import express, { Request, Response, NextFunction } from 'express';
import {
    AddFood,
    GetFood,
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


// const handler =  (req: Request, res: Response, next: NextFunction) => {
//     return new Promise<void>((resolve, reject) => {
//         console.log("handler reached");
//         try {
//             images(req, res, (err) => {
//                 // console.log(" middleware images reached");
//                 if (err) {
//                     console.log("error:", err);
//                     reject(err);
//                 } else {
//                     console.log("no errors");
//                     console.log("calling next function");
//                     resolve();
//                 }
//             });
//         } catch (error) {
//             reject(error);
//         }
//     });
// }

router.post('/login', asyncHandler(VandorLogin));

router.use(Authenticate);

router.get('/profilee', (req: Request, res: Response, next: NextFunction) => {
    GetVandorProfile(req, res, next);
});

router.patch('/profile', asyncHandler(UpdateVandorProfile));
router.patch('/coverimage',images, asyncHandler(UpdateVandorCoverImage));

router.get('/service', asyncHandler(UpdateVandorService));

router.post('/food',images,asyncHandler(AddFood));


router.get('/food', asyncHandler(GetFood));

router.get('/', (req: Request, res: Response) => {
    res.json({ message: 'Hello Admin' });
});

export { router as VandorRoute };
