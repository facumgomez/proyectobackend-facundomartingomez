import ticketModel from '../../dao/models/ticketModel.js';
import { productService } from '../repository.js';

export default class cartsRepository {
  constructor(dao) {
    this.dao = dao;
  };

  getCarts = async () => {
    return await this.dao.getAll();
  };

  getCartById = async (cid) => {
    return await this.dao.getByIdPopulate(cid);
  };

  getById = async (cid) => {
    return await this.dao.getById(cid);
  };

  createCart = async () => {
    let cartCreate = await this.dao.create();
    return cartCreate;
  };

  addProduct = async (cid, pid) => {
    const cartUpdate = await this.dao.getById(cid);
    if (!cartUpdate) 
      return null;
    const product = cartUpdate.products.find(p => p.product == pid);
    if (!product) {
      cartUpdate.products.push({product: pid, quantity: 1});
      await this.dao.update(cid, cartUpdate);
      return cartUpdate;
    } else {
      product.quantity++;
      await this.dao.update(cid, cartUpdate);
      return cartUpdate;
    };
  };

  deleteProduct = async (cid, pid) => {
    const cart = await this.dao.getById(cid);
    const product = cart.products.findIndex(p => p.product == pid);
    if (product <= 0)
      return null;
    cart.products.splice(product, 1);
    await this.dao.update(cid, cart);
    return cart;
  };

  updateCart = async (cid, body) => {
    const cart = await this.dao.getById(cid);
    cart.products = body;
    await this.dao.update(cid, cart);
    return cart;
  };

  updateQuantity = async (cid, pid, body) => {
    const cart = await this.dao.getById(cid);
    if (!cart) 
      return null;
    const product = cart.products.find(p => p.product == pid);
    if (!product) 
      return null;
    product.quantity = body;
    await this.dao.update(cid, cart);
    return cart;
  };

  clearCart = async (cid) => {
    const cart = await this.dao.getById(cid);
    if (!cart) 
      return null;
    cart.products = [];
    await this.dao.update(cid, cart);
    return cart;
  };

  deleteCart = async (cid) => {
    return await this.dao.delete(cid);
  };

  purchaseComplete = async (cid, user) => {
    const unavailableProducts = [];
    const purchaseProducts = [];
    let total = 0;
    const cart = await this.dao.getById(cid);
    for(let i = 0; i < cart.products.length ; i++) {
      let pid = cart.products[i].product.toString();
      let product = await productService.getProductById(pid);
      let productCart = cart.products[i];
      if (product.stock < productCart.quantity) {
        unavailableProducts.push(productCart);
      } else {
        product.stock -= productCart.quantity;
        total += product.price * productCart.quantity;
        purchaseProducts.push(productCart);
        await productService.updateProduct(pid, product);
      };
    };
    cart.products = unavailableProducts;
    await this.dao.update(cid, cart);
    const tickets = await ticketModel.find();
    if (purchaseProducts.length !== 0) {
      let newTicket;
      if (tickets.length === 0) {
        newTicket = await ticketModel.create({ 
          code: '1',
          purchaseDatetime: Date.now(),
          amount: total,
          purchaser: user
        });
      } else {
        const latestCode = tickets[tickets.length - 1].code;
        const newCode = (parseInt(latestCode) + 1);
        newTicket = await ticketModel.create({ 
          code: newCode,
          purchaseDatetime: Date.now(),
          amount: total,
          purchaser: user
        });
      }
      return {
        status: 'success',
        message: 'Éxitosa compra.',
        ticket: newTicket,
        newCart: cart,
        unavailableProducts: unavailableProducts
      };
    } else {
      return {
        status: 'error',
        message: 'No hay stock suficiente.',
        unavailablProducts: unavailableProducts
      };
    };
  };
}