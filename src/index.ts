import express from "express";
import App from "./services/express";
import dbConnection from "./services/Database";
import { PORT } from "./config";


const StartServer = async () => {
    require('dotenv').config();
    const app = express();
  
    await App(app);
  
    console.clear();
    
    await dbConnection();

    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });

};

StartServer();