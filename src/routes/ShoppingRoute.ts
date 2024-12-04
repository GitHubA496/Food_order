import express,{Request,Response,NextFunction} from 'express';
import { GetFoodAvailablity, GetFoodIn30mins, GetTopRestaurants, RestaurantById, SearchFood } from '../controllers';
import { asyncHandler } from './VandorRoute';
const router = express.Router();



router.get('/:pincode',asyncHandler(GetFoodAvailablity));

router.get('/top-restaurants/:pincode',asyncHandler(GetTopRestaurants));

router.get('/foods-in-30-mintues/:pincode',asyncHandler(GetFoodIn30mins));

router.get('/search/:pincode',asyncHandler(SearchFood));

router.get('/restaurants/:id',asyncHandler(RestaurantById));

export {router as ShoppingRoute};