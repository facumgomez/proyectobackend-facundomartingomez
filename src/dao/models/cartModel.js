import mongoose, { Schema, model } from 'mongoose';

const cartCollection = 'carts';
const cartSchema = new Schema({
  products: {
    type: [{
      product: {
        type: Schema.Types.ObjectId,
        ref: 'products',
        required: true
      },
      quantity: {
        type: Number,
        required: true
      }
    }],
    default: [],
    _id: false
  }
});

mongoose.set('strictQuery', false);
cartSchema.pre('find', function() {
  this.populate('products.product');
});

cartSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});
const cartModel = model(cartCollection, cartSchema);

export default cartModel;