import express,{Application} from 'express';
import { AdminRoute, UserRoute, VandorRoute } from '../routes';
import path from 'path';
import { ShoppingRoute } from '../routes';


export default async function (app: Application) {
    
    
    app.use(express.json());
    app.use(express.urlencoded({extended: true}))
    const imagePath = path.join(__dirname, '../images'); 
    app.use('/images',express.static(imagePath));
    
    app.use('/admin',AdminRoute);
    app.use('/vandor',VandorRoute);
    app.use('/customer',UserRoute)
    app.use(ShoppingRoute) 
    
}