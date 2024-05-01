import { Schema, model } from "mongoose";

const cartCollection = 'cart';

const cartSchema = new Schema({

  products: [
    {
      id:{
        type:Schema.Types.ObjectId,
        ref: "product",
        required: true
        },
      quantity: {
        type: Number,
        required: true
      },
      _id:false
    }
  ],
});

cartSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});
const cartModel = model(cartCollection, cartSchema);

export default cartModel;