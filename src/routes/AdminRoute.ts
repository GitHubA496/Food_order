import express,{Request,Response, NextFunction} from 'express';
import { CreateVandor, GetVandors, GetVendorByID } from '../controllers';
const router = express.Router();

router.post('/vandor',(req: Request, res: Response, next: NextFunction) => {
    CreateVandor(req, res, next);
  });

router.get('/vandors',async (req: Request, res: Response, next: NextFunction) => {
    await GetVandors(req, res, next);
});

router.get('/vandor/:id',async (req: Request, res: Response, next: NextFunction) => {
  await GetVendorByID(req, res, next);
});


router.get('/',(req :Request , res: Response, next: NextFunction) =>{
    res.json({message : 'Hello Admin'})
});

export {router as AdminRoute};