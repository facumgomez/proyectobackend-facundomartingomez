import CartsMemoryDao from '../dao/cartsMemoryDao.js';

export default class cartsService {
  constructor() {
    this.cartsMemoryDao = new CartsMemoryDao();
  };

  getCarts = async () => {
    return await this.cartsMemoryDao.getAll();
  };

  getCartById = async (cid) => {
    return await this.cartsMemoryDao.getByIdPopulate(cid);
  };

  getById = async (cid) => {
    return await this.cartsMemoryDao.getById(cid);
  };

  createCart = async () => {
    let cartCreate = await this.cartsMemoryDao.create();
    return cartCreate;
  };

  addProduct = async (cid, pid) => {
    const cartUpdate = await this.cartsMemoryDao.getById(cid);
    if (!cartUpdate) 
      return null;
    const product = cartUpdate.products.find(p => p.product == pid);
    if (!product) {
      cartUpdate.products.push({product: pid, quantity: 1});
      await this.cartsMemoryDao.update(cid, cartUpdate);
      return cartUpdate;
    } else {
      product.quantity++;
      await this.cartsMemoryDao.update(cid, cartUpdate);
      return cartUpdate;
    };
  };

  deleteProduct = async (cid, pid) => {
    const cart = await this.cartsMemoryDao.getById(cid);
    const product = cart.products.findIndex(p => p.product == pid);
    if (product <= 0)
      return null;
    cart.products.splice(productIndex, 1);
    await this.cartsMemoryDao.update(cid, cart);
    return cart;
  };

  updateCart = async (cid, body) => {
    const cart = await this.cartsMemoryDao.getById(cid);
    cart.products = body;
    await this.cartsMemoryDao.update(cid, cart);
    return cart;
  };

  updateQuantity = async (cid, pid, body) => {
    const cart = await this.cartsMemoryDao.getById(cid);
    if (!cart) 
      return null;
    const product = cart.products.find(p => p.product == pid);
    if (!product) 
      return null;
    product.quantity = body;
    await this.cartsMemoryDao.update(cid, cart);
    return cart;
  };

  clearCart = async (cid ) => {
    const cart = await this.cartsMemoryDao.getById(cid);
    if (!cart) 
      return null;
    cart.products = [];
    await this.cartsMemoryDao.update(cid, cart);
    return cart;
  };

  deleteCart = async (cid) => {
    return await this.cartsMemoryDao.delete(cid);
  };
}