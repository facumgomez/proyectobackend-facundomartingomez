import { Schema, model } from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const productCollection = 'products';

const productSchema = new Schema({
  title: {
    type: String, 
    required: [true, 'El titulo del producto es requerdio']
  },
  category: {
    type: String, 
    required: [true, 'La categoria del producto es requerdio']
  },
  thumbnail:{
    type: String, 
    required: [true, 'La imagen del producto es requerdio']
  },
  description: {
    type: String, 
    required: [true, 'La descripcion del producto es requerdio']
  },
  price: {
    type: Number, 
    required: [true, 'El precio del producto es requerdio']
  },
  code: {
    type: String, 
    required: [true, 'El codigo del producto es requerdio'], 
    unique: true
  },
  stock: {
    type: Number, 
    required: [true, 'El stock del producto es requerdio']
  }, 
  status: {
    type: Boolean, 
    default: true
  },
  owner: { 
    type: String, 
    required: true, 
    default: 'admin' 
  }
});

productSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

productSchema.plugin(mongoosePaginate);
const productModel = model(productCollection, productSchema);

export default productModel;