import { Express , Request, Response, NextFunction} from "express";
import { LoginVandorInput, UpdateVandorInput } from "../dto";
import { FindVandor } from "./AdminController";
import { validatePassword, GenerateSignature } from "../utility";
import { CreateFoodInput } from "../dto";
import { Food } from "../models/Food";
import multer from "multer";
import { Order } from "../models";
export const VandorLogin = async (req: Request, res: Response, next: NextFunction) => {
    try{
        
        const {email, password} = <LoginVandorInput>req.body;
        
        const existingVandor = await FindVandor(" ",email)
        
        if(existingVandor !== null){
            const validation =await validatePassword(password,existingVandor.password,existingVandor.salt)
            
            if(validation === true){
                const signature = GenerateSignature({
                    _id: existingVandor.id,
                    email: existingVandor.email,
                    name: existingVandor.name,
                    foodType: existingVandor.foodType});
                    
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
        }
        

export const GetVandorProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;
        if (!user || !user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const existingVandor = await FindVandor(user._id);

        if (!existingVandor) {
            return res.status(404).json({ message: 'Vandor not found' });
        }

        console.log(existingVandor);
        // return res.status(200).json(existingVandor);
        return  res.status(200).json(existingVandor);
    } catch (error) {
        if (!res.headersSent) {
            return res.status(500).json({ message: 'Internal Server Error' });
        }
        console.error('GetVandorProfile Error:', error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const UpdateVandorProfile = async (req :Request , res: Response, next: NextFunction) => {
    const {name ,  foodType ,  address , phone} = <UpdateVandorInput>req.body

    const user = req.user;

        if (!user || !user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }

        const existingVandor = await FindVandor(user._id);

        if (!existingVandor) {
            return res.status(404).json({ message: 'Vandor not found' });
        }

        existingVandor.name = name;
        existingVandor.foodType = foodType;
        existingVandor.address = address;
        existingVandor.phone = phone;
        const savedResult = await existingVandor.save();

        return res.status(200).json(savedResult);
};

export const UpdateVandorService = async (req :Request , res: Response, next: NextFunction) => {
    try {
    const user = req.user;

    if (!user || !user._id) {
        return res.status(401).json({ message: 'User not authenticated' });
    }

    const existingVandor = await FindVandor(user._id);

    if (!existingVandor) {
        return res.status(404).json({ message: 'Vandor not found' });
    }

    existingVandor.serviceAvailable = !existingVandor.serviceAvailable;
    const savedResult = await existingVandor.save();

    return res.status(200).json(savedResult);
} catch (error) {
    if (!res.headersSent) {
        return res.status(500).json({ message: 'Internal Server Error' });
    }
    console.error('UpdateVandorService Error:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
}
};


export const UpdateVandorCoverImage = async (req :Request , res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        if (!user || !user._id) {
            return res.status(401).json({ message: 'User not authenticated' });
        }
        const existingVandor = await FindVandor(user._id);

        if (!existingVandor) {
            return res.status(404).json({ message: 'Vandor not found' });
        }

        if (req.file) {
            const files = req.files as Express.Multer.File[];
            const images = files.map((file: Express.Multer.File) => file.filename);
            existingVandor.coverImages.push(...images);
            const savedResult = await existingVandor.save();

            return res.status(200).json(savedResult);
        } else {
            return res.status(400).json({ message: 'No file uploaded' });
            // return res.status(400).json({ message: req.body });
        }
    }
        catch (error) {
            if (!res.headersSent) {
                return res.status(500).json({ message: 'Internal Server Error' });
            }
            console.error('UpdateVandorCoverImage Error:', error);
            return res.status(500).json({ message: 'Internal Server Error' }); 
        }   
}


export const AddFood = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log("AddFood function reached");
        console.log("req.file:", req.file);
        console.log("req.body:", req.body);
    const user = req.user;
    
    if (!user || !user._id) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    
    const { name, description, category, foodType, readytime, price } = <CreateFoodInput>req.body;
    if (!name || !description || !foodType || !price ) {
        return res.status(400).json({ message: 'Missing required fields: name, description, foodType, price' });
    }

    const vendor = await FindVandor(user._id);
    // const vendor = await FindVandor('674712d9995a75077feb0b9e');

    if (!vendor) {
        return res.status(404).json({ message: 'Vandor not found' });
    }

    const files = req.files as Express.Multer.File[];
    const images = files.map((file: Express.Multer.File) => file.filename);

    const createdFood = await Food.create({
        vandorId: vendor._id,
        name: name,
        description: description,
        category: category,
        foodType: foodType,
        readytime: readytime,
        price: price,
        rating: 0,
        images: images
    });

    vendor.foods.push(createdFood._id);
    
    console.log("Test Food Created:", createdFood);
    const result = await vendor.save();
    return res.status(201).json(createdFood);

} catch (error) {
    if (!res.headersSent) {
        return res.status(500).json({ message: error });
    }
    console.error('AddFood Error:', error);
    return res.status(500).json({ message: error });
}
};




export const GetFood = async (req: Request, res: Response, next: NextFunction) => {
    try {
    const user = req.user;

    if (!user || !user._id) {
        return res.status(401).json({ message: 'User not authenticated' });
    }
    const vendor = await FindVandor(user._id);

    if (!vendor) {
        return res.status(404).json({ message: 'Vandor not found' });
    }

    const foods = await Food.find({ vandorId: vendor._id });

    return res.status(200).json(foods);
} catch (error) {
    if (!res.headersSent) {
        return res.status(500).json({ message: error });
    }
    console.error('AddFood Error:', error);
    return res.status(500).json({ message: error });
}
};

export const GetCurrentOrder = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (user){
        const orders = await Order.findOne({vandorId: user._id, orderStatus: "pending"}).populate('items.food');
        if(orders!== null){
            return res.status(200).json(orders);
        }
    }
}
export const GetOrderDetails = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;
    if (orderId){
        const order = await Order.findById(orderId).populate('items.food');
        if(order!== null){
            return res.status(200).json(order);
        }
    }
}
export const ProcessOrder = async (req: Request, res: Response, next: NextFunction) => {
    const orderId = req.params.id;

    const {status,remarks, time} = req.body

    if (orderId){
        const order = await Order.findById(orderId).populate('items.food');
        
        if(order!== null){
        
        order.orderStatus = status;
        order.remarks = remarks;
        if(time){
            order.readyTime = time;}

        const orderResult = await order.save();
        return res.status(200).json(orderResult);
        }
    }
}
export const UpdateOffer = async (req: Request, res: Response, next: NextFunction) => {
    
}

export const CreateOffer = async (req: Request, res: Response, next: NextFunction) => {


}
export const GetOffer = async (req: Request, res: Response, next: NextFunction) => {

}