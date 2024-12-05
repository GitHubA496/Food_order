import express, {Request,Response,NextFunction} from 'express';
import { CreateCustomerInput, CustomerLoginInput, EditCustomerProfileInputs, OrderInputs } from '../dto/Customer.dto';
import {plainToClass} from 'class-transformer';
import {Validate, validate, ValidationError} from 'class-validator';
import { GenerateOTP, GenerateSalt, GenerateSignature, hashPassword, OnRequestOTP, validatePassword } from '../utility';
import { Food, Order, User } from '../models';

export const UserSignUp = async (req :Request , res: Response, next: NextFunction) => {

    const UserInput = plainToClass(CreateCustomerInput,req.body);
    const errors = await validate(UserInput,{validationError:{target: true}});

    if(errors.length > 0){
        return res.status(400).json({errors});
    }

    const {email,phone,password} = UserInput;
    const salt = await GenerateSalt();
    const userPassword = await hashPassword(password,salt);

    const {otp,expiry: otp_expiry} =  GenerateOTP();


    const already = await User.findOne({email : email});
    if( already !== null){
        return res.status(400).json({message : 'Email already exists'});
    }


    // console.log(otp,otp_expiry);
    // return res.status(200).json({message: 'working'});

    const user = await User.create({
        email,phone,password:userPassword,salt,
        firstName:" ",
        lastName:" ",
        address:" ",
        verified:false,
        otp:otp,
        otp_expiry:otp_expiry,
        lat:"0",
        lng:"0",
        orders:[]
    });

    if(user){
        await OnRequestOTP(otp,phone);

        const signature = GenerateSignature({
            _id:user._id as string,
            email:user.email,
            verified:user.verified
        })
        
        return res.status(200).json({message:"User created successfully",signature});
    }

};

export const UserLogin = async (req :Request , res: Response, next: NextFunction) => {
    try{
        const UserInput = plainToClass(CustomerLoginInput,req.body);
        const errors = await validate(UserInput,{validationError:{target: true}});

        if(errors.length >0){
            res.status(400).json(errors)
        }

        const {email, password} = UserInput;
        
        const existingCustomer = await User.findOne({email : email})
        
        
        if(existingCustomer !== null){
            const validation =await validatePassword(password,existingCustomer.password,existingCustomer.salt)
            
            if(validation === true){
                const signature = GenerateSignature({
                    _id: existingCustomer.id,
                    email: existingCustomer.email,
                    verified: existingCustomer.verified
                });
                    
                    return res.json(signature);
                }
                else{
                    return res.json({message : 'Invalid Password'});
                }
            }
        }
        catch(error){
            console.error("Login Error",error);
        }
};

export const UserVerification = async (req :Request , res: Response, next: NextFunction) => {
    const {otp} = req.body;
    const Customer = req.user;
    if(Customer){
        const profile= await User.findById(Customer._id);
        
        if(profile){
            
            // console.log(profile.otp)
            // console.log(otp)
            // console.log(new Date())
            // console.log(profile.otp_expiry)
            
            if(profile.otp === parseInt(otp) && profile.otp_expiry >= new Date()){
                profile.verified = true;

                const UpdatedCustomerResponse=  await profile.save();

                const signature = GenerateSignature({
                    _id:UpdatedCustomerResponse._id as string,
                    email:UpdatedCustomerResponse.email,
                    verified:UpdatedCustomerResponse.verified
                })
                
                return res.status(200).json({message:"User created successfully",signature});
        }
    }
};
}

export const GetOTP = async (req :Request , res: Response, next: NextFunction) => {

    const Customer = req.user;

    if(Customer){
        const profile= await User.findById(Customer._id);
        if(profile){
            if(profile.otp_expiry >= new Date()){
                OnRequestOTP(profile.otp,profile.phone)
                return res.status(200).json("Send OTP");
            }
            else{
                const {otp,expiry} = GenerateOTP()
                profile.otp = otp;
                profile.otp_expiry = expiry;
                const UpdatedCustomerResponse=  await profile.save()
                const signature = GenerateSignature({
                    _id:UpdatedCustomerResponse._id as string,
                    email:UpdatedCustomerResponse.email,
                    verified:UpdatedCustomerResponse.verified
                })
                
                OnRequestOTP(otp,profile.phone);
                return res.status(200).json({message:"OTP send successfully",signature});
            }
        }
        else{
            return res.status(404).json({message : 'User Not Found'});
        }
    }
    else{
        return res.status(400).json({message:'Token Malfunction'})
    }
};

export const GetProfile = async (req :Request , res: Response, next: NextFunction) => {
    try{
        const Customer = req.user;
        if(Customer){
            const profile = await User.findById(Customer._id);
            if(profile){
                return res.status(200).json(profile);
            }
            else{
                return res.status(404).json({message : 'User Not Found'});
            }
        }
        else{
            return res.status(400).json({message:'Token Malfunction'})
        }
    }
    catch(error){
        console.error("Error Occured",error);
    }
};

export const UpdateProfile = async (req :Request , res: Response, next: NextFunction) => {
    try{

        const Customer = req.user;
        
        const UserInput = plainToClass(EditCustomerProfileInputs,req.body);
        const errors = await validate(UserInput,{validationError:{target: true}});
        
        if(errors.length >0){
            res.status(400).json(errors)
        }

        const {firstname, lastname,address} = UserInput;
        
        
        if(Customer){
            const profile= await User.findById(Customer._id);
         if(profile){
             profile.firstName = firstname;
             profile.lastName = lastname;
             profile.address = address;
             const UpdatedCustomerResponse=  await profile.save();
             const signature = GenerateSignature({
                _id:UpdatedCustomerResponse._id as string,
                email:UpdatedCustomerResponse.email,
                verified:UpdatedCustomerResponse.verified
            })
             return res.status(200).json({message:"User created successfully",signature});
        }
    }
    }
    catch(error){
        console.error("Login Error",error);
    }
};

export const AddToCart = async (req :Request , res: Response, next: NextFunction) => {
 
    const customer = req.user;

    if(customer){
        const profile = await User.findById(customer._id);
        // console.log(profile)
        let cartItems =  Array();

        const {_id,units} = <OrderInputs>req.body;
        
        const food = await Food.findById(_id);
        if(food){
            
            if(profile !== null){
                cartItems = profile.cart;
                
                if(cartItems.length > 0){
                    let existingFood = cartItems.filter((item) => item.food._id.toString() === _id);
                    console.log(existingFood)
                    if(existingFood){
                        const index = cartItems.indexOf(existingFood[0]);
                        if(units >0){
                            cartItems[index].units += units;
                        }else{
                            cartItems.splice(index,1);
                        }
                    }
                    else{
                        cartItems.push({
                            food,
                            units
                        })
                    }
                }
                else{
                    cartItems.push({
                        food ,
                        units
                    })
                }

                if(cartItems){
                    profile.cart = cartItems as any;
                    const result = await profile.save();
                    return res.status(200).json(result.cart); 
                }
            } 
                

        }

    }

     return res.status(400).json({message:'no customer Found'})
    }


export const GetCart = async (req :Request , res: Response, next: NextFunction) => {
    const customer = req.user;
    if(customer){
        const profile = await User.findById(customer._id).populate('cart.food');
        if(profile !== null){
            return res.status(200).json(profile.cart);
        }
    }
    return res.status(400).json({message:'Cart is Empty'})
}

export const RemoveFromCart = async (req :Request , res: Response, next: NextFunction) => {
    const customer = req.user;
    if(customer){
        const profile = await User.findById(customer._id).populate('cart.food');
        if(profile !== null){
            profile.cart = [] as any;
            const result = await profile.save();
            return res.status(200).json(result.cart);
        }
    }
    return res.status(400).json({message:'Cart is already Empty'})
}
export const CreateOrder = async (req: Request, res: Response, NextFunction : NextFunction) => {
        const customer = req.user;
        if(customer){
            const OrderID = `${Math.floor(Math.random() *889999) +1000}`

            const profile = await User.findById(customer._id);

            const cart = <[OrderInputs]>req.body;

            let cartitems = [];
            let total = 0;
            let vandorId;

            const foods = await Food.find().where('_id').in(cart.map(item => item._id)).exec();

            foods.map(food => {
                
                cart.map(({_id,units}) => {
                    
                    if(food._id == _id){
                        total += food.price * units;
                        cartitems.push({food,units,price : food.price});
                        vandorId = food.vandorId
                    }
            })
            })
            if(cartitems.length > 0){
                const CurrOrder = await Order.create({
                    vandorId:vandorId,
                    OrderId:OrderID,
                    customer:profile,
                    items:cartitems,
                    totalAmount:total,
                    orderStatus:"pending",
                    paidthrough:"cash",
                    paymentResponse:"pending",
                    deliveryId:"",
                    appliedOffers:false,
                    remarks:"",
                    offerId: null,
                    readyTime: 45
                })

                if (CurrOrder){
                    profile.cart = [] as any;

                    profile.orders.push(CurrOrder);
                    const UpdatedCustomerResponse=  await profile.save();
                    return res.status(200).json(UpdatedCustomerResponse);

                }
                else{
                    return res.status(400).json({message : 'Error in creating order'});
                }
            }

        }
}
export const GetOrder = async (req: Request, res: Response, NextFunction : NextFunction) => {
    const customer = req.user;
    if(customer){
        const profile = await User.findById(customer._id);
        const order = await Order.findById(profile.orders[0]).populate('items.food');
        if(order){
            return res.status(200).json(order);
        }
      

    }

}
export const getOrderById = async (req: Request, res: Response, NextFunction : NextFunction) => {

}