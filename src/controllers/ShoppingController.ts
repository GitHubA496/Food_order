import { Express,Request,Response, NextFunction } from "express";
import { FoodDoc, Vandor } from "../models";


export const GetFoodAvailablity = async (req :Request , res: Response, next: NextFunction) => {

    const pincode = req.params.pincode;
    console.log(pincode);
    const seller = await Vandor.find({pincode : pincode , serviceAvailable: true})
    .sort([['rating','descending']])
    .populate('foods');

    if (seller.length > 0){
        return res.status(200).json(seller);
    }
    return res.status(400).json({message : 'No Vandors found'});
}

export const GetTopRestaurants = async (req :Request , res: Response, next: NextFunction) => {
    const pincode = req.params.pincode;

    const restaurants  = await Vandor.find({pincode : pincode , serviceAvailable: true})
    .sort([['rating','descending']])
    .limit(5)

    if (restaurants.length > 0){
        return res.status(200).json(restaurants);
    }
    return res.status(400).json({message : 'No Vandors found'});
}

export const GetFoodIn30mins = async (req :Request , res: Response, next: NextFunction) => {
    const pincode = req.params.pincode;

    const seller = await Vandor.find({pincode : pincode , serviceAvailable: true})
    .populate('foods');

    if (seller.length > 0){
        let foodResult :any = [];

        seller.map((vandor :any) => {
            const food = vandor.foods as [FoodDoc];

            foodResult.push(...food.filter(food => food.readytime <= 30));
        })        
        return res.status(200).json(foodResult);
    }
    return res.status(400).json({message : 'No Vandors found'});
}

export const SearchFood = async (req :Request , res: Response, next: NextFunction) => {
    const pincode = req.params.pincode;

    const seller = await Vandor.find({pincode : pincode , serviceAvailable: true})
    .populate('foods');

    if (seller.length > 0){
        let foodResult :any = [];

        seller.map((vandor :any) => foodResult.push(...vandor.food));

        return res.status(200).json(foodResult);
    }
    return res.status(400).json({message : 'No Vandors found'});

 }

export const RestaurantById = async (req :Request , res: Response, next: NextFunction) => {

    const id = req.params.id;

    const result = await Vandor.findById(id);
    if (result) {
        res.status(200).json(result);
    }
    return res.status(400).json({message : 'No Vandors found'});
}