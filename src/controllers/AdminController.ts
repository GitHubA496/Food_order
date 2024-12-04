import { Request, Response , NextFunction} from "express";
import { CreateVandorInput } from "../dto";
import { Vandor } from "../models";
import { GenerateSalt, hashPassword } from "../utility";


export const FindVandor = async (id: string | undefined, email?: string) => {
    if (id && id.trim() !== "") {
        return await Vandor.findById(id);
      } else if (email) {
        return await Vandor.findOne({ email: email });
      } else {
        throw new Error("Invalid id or email");
      }
}

export const CreateVandor = async (req :Request , res: Response, next: NextFunction) => {
    const {name , ownerName , foodType , pincode , address , phone , email , password} = <CreateVandorInput>req.body

    const existingVandor = await FindVandor(" ",email)

    if(existingVandor){
        return res.json({message : 'Vandor already exists'});
    }

    const salt = await GenerateSalt();
    const passwordHashed = await hashPassword(password , salt);

    const createdVandor = await Vandor.create({
        name : name,
        address : address,
        pincode : pincode,
        ownerName : ownerName,
        foodType : foodType,
        phone : phone,
        email : email,
        password : passwordHashed,
        salt: salt,
        rating: 0,
        coverImages: [],
        serviceAvailable: false,
        foods: []
    })

    return res.json(createdVandor);
}  


export const GetVandors = async (req :Request , res: Response, next: NextFunction) => {
    const vandors = await Vandor.find();

    if(vandors !== null){
        return res.json(vandors);
    }
    return res.json({message : 'No Vandors found'});
}  


export const GetVendorByID = async (req :Request , res: Response, next: NextFunction) => {
    const vandorId = req.params.id
    
    const vandor = await FindVandor(vandorId);

    if(vandor !== null){
        return res.json(vandor);
    }
    return res.json({message : 'No Vandors found'}); 
}  