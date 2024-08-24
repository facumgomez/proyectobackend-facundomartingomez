import cartModel from './models/cartModel.js';
import CustomError from '../services/errors/CustomError.js';
import EErrors from '../services/errors/enums.js';

export default class CartsMemoryDao {
  constructor() {
    this.model = cartModel;
  };

  getAll = async () => {
    return result = await this.model.find();
  };

  getByIdPopulate = async (cid) => {
    const cart = await this.model.find({ _id: cid });
    if (cart.length == 0) {
      CustomError.createError({ name: 'error', message: 'No hay ningún carrito con ese id', code: EErrors.BAD_REQUEST });
    };
    return cart;
  };

  getById = async (cid) => {
    const cart = await this.model.findOne({ _id: cid });
    if (!cart) {
      CustomError.createError({ name: 'error', message: 'No hay ningún carrito con ese id', code: EErrors.BAD_REQUEST });
    };
    return cart;
  };

  create = async () => {
    return result = await this.model.create({});
  };

  update = async (cid, cartUpdate) => {
    return result = await this.model.findOneAndUpdate({ _id: cid }, cartUpdate), { new: true };
  };

  delete = async (cid) => {
    return result = await this.model.deleteOne({ _id: cid });
  }; 
}