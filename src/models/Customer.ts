import mongoose, {Schema, Document,Model} from "mongoose";
import { Order, OrderDoc } from "./Order";
import { Food } from "./Food";
// import { Food } from "./Food";
interface CustomerDoc extends Document{
    email : string;
    phone : string;
    password : string;
    salt : string;
    firstName : string;
    lastName : string;
    address : string;
    verified : boolean;
    otp: number;
    otp_expiry: Date;
    lat: number;
    lng : number;
    cart: [any];
    orders: [OrderDoc]
}

const CustomerSchema = new Schema({
    email :{type: String , required : true},
    phone : {type: String , required : true},
    password : {type: String , required : true},
    salt : {type: String , required : true},
    firstName : {type: String , required : true},
    lastName : {type: String , required : true},
    address : {type: String , required : true},
    verified : {type: Boolean , required : true},
    otp: {type: Number, required : true},
    otp_expiry: {type: Date , required : true},
    lat: {type: Number},
    lng : {type: Number},
    cart : [{
        food: { type: mongoose.SchemaTypes.ObjectId, ref: Food, required: true },
        units: { type: Number, required: true },
    }],
    orders: [{type: mongoose.SchemaTypes.ObjectId , ref: Order}]
},
{
    toJSON: {
        transform(doc,ret){
            delete ret.password;
            delete ret.salt;
            delete ret.__v;
            delete ret.createdAt;
            delete ret.updatedAt;
        }
    },
    timestamps: true
});


const User = mongoose.model<CustomerDoc>('customer', CustomerSchema);

export {User};