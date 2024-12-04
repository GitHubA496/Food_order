import mongoose from 'mongoose';


export default async () => {
    
    const connectionOptions: mongoose.ConnectOptions = {
    }
    
    await mongoose.connect(process.env.MONGO_URI, connectionOptions)
  .then(() => console.log("Connected to MongoDB"))
  .catch(err => console.error("Connection error:", err));

}
 
