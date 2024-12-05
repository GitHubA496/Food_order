import express, { Request, Response, NextFunction } from 'express';
import {
    AddFood,
    GetFood,
    CreateOffer,
    GetCurrentOrder,
    GetOffer,
    GetOrderDetails,
    ProcessOrder,
    UpdateOffer,
    GetVandorProfile,
    UpdateVandorCoverImage,
    UpdateVandorProfile,
    UpdateVandorService,
    VandorLogin,
} from '../controllers';
import { Authenticate } from '../middlewares';
import { images } from '../upload';
// import multer from 'multer';
// import fs from 'fs';
// import path from 'path';

const router = express.Router();

// Utility function to handle async route handlers
export const asyncHandler =
    (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) =>
    (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };




router.post('/login', asyncHandler(VandorLogin));

router.use(Authenticate);

router.get('/profile', (req: Request, res: Response, next: NextFunction) => {
    GetVandorProfile(req, res, next);
});

router.patch('/profile', asyncHandler(UpdateVandorProfile));
router.patch('/coverimage',images, asyncHandler(UpdateVandorCoverImage));

router.get('/service', asyncHandler(UpdateVandorService));

router.post('/food',images,asyncHandler(AddFood));
router.get('/food', asyncHandler(GetFood));

//order
router.get('/order', asyncHandler(GetCurrentOrder));
router.put('/order/:id/process', asyncHandler(ProcessOrder));
router.get('/order/:id', asyncHandler(GetOrderDetails));

// //offers
router.get('/offers',asyncHandler(GetOffer))
router.post('/offer',asyncHandler(CreateOffer))
router.put('/offer/:id',asyncHandler(UpdateOffer))


router.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello Admin' });
});

export { router as VandorRoute };
