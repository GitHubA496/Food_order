import { Router } from "express";
import { CreateOrder, GetOrder, getOrderById, GetOTP, GetProfile, UpdateProfile, UserLogin, UserSignUp, UserVerification } from "../controllers";
import { asyncHandler } from "./VandorRoute";
import { Authenticate } from "../middlewares";
const router = Router();

/*login and signup*/ 
router.post('/signup',asyncHandler(UserSignUp))
router.post('/login',asyncHandler(UserLogin))

/*using authenticator*/ 
router.use(Authenticate)
/*verify*/ 
router.patch('/verify',asyncHandler(UserVerification))
/*getotp*/ 
router.get('/otp',asyncHandler(GetOTP))

/*getprofile*/ 
router.get('/profile',asyncHandler(GetProfile))
/*updateProfile*/ 
router.patch('/profile',asyncHandler(UpdateProfile))

//cart
//Payment

//Order
router.post('/create-order',asyncHandler(CreateOrder))
router.get('/orders',asyncHandler(GetOrder))
router.get('/order/:id',asyncHandler(getOrderById))


export {router as UserRoute}