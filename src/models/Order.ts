import mongoose, { Schema, Document } from "mongoose";
import { Vandor } from "./Vandor";  // Assuming you already have this model
import { Food } from "./Food";  // Assuming you already have this model

export interface OrderDoc extends Document {
    vandorId :string,
    OrderId :string,
    items : [any],
    totalAmount : number,
    orderDate : Date,
    paidthrough : string,
    paymentResponse : string,
    orderStatus : string,
    remarks : string,
    deliveryId : string,
    appliedOffers: boolean,
    offerId: string,
    readyTime: number
}

const OrderSchema = new Schema(
    {   vandorId: { type: String, required: true },
        OrderId: { type: String, required: true, unique: true },
        items: [
          {
            food: { type: mongoose.SchemaTypes.ObjectId, ref: Food, required: true },
            units: { type: Number, required: true },
            price: { type: Number, required: true },
          },
        ],
        totalAmount: { type: Number, required: true },
        orderDate: { type: Date, default: Date.now },
        paidthrough: { type: String, enum: ['cash', 'card', 'online'], required: true },
        paymentResponse: { type: String, required: true },
        orderStatus: { type: String, enum: ['pending', 'accepted', 'completed', 'cancelled'], default: 'pending' },
        remarks: { type: String },
        deliveryId: { type: String },
        appliedOffers: { type: Boolean, default: false },
        offerId: { type: String },
        readyTime: { type: Number },
      },
  {
    toJSON: {
      transform(doc, ret) {
        // Hide sensitive information
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Order = mongoose.model<OrderDoc>('Order', OrderSchema);

export { Order };
