import ticketModel from '../../dao/models/ticketModel.js';
import CustomError from '../errors/CustomError.js';
import EErrors from '../errors/enums.js';
import { productService, userService } from '../repository.js';
import GenericRepository from './genericRepository.js';

export default class CartsRepository extends GenericRepository {
  constructor(dao) {
    super(dao);
  };

  getPopulated = async (cid) => {
    return await this.dao.getByIdPopulate(cid);
  };

  addProduct = async (cid, pid, user) => {
    const getProduct = await productService.getById(pid);
    if (user.role == 'premium' && getProduct.owner == user._id) {
      CustomError.createError({ name: 'No autorizado', message: 'No tienes los permisos para hacer esto.', code: EErrors.UNAUTHORIZED });
    };

    const cart = await this.dao.getById(cid);
    const product = cart.products.find(p => p.product == pid);
    if (!product) {
      cart.products.push({ product: pid, quantity: 1 });
    } else {
      product.quantity++;
    };
    return await this.dao.update(cid, cart);
  };

  deleteProduct = async (cid, pid) => {
    const cart = await this.dao.getById(cid);
    const product = cart.products.findIndex(p => p.product == pid);
    if (product < 0) {
      CustomError.createError({ name: 'error', message: 'No hay ningún producto con ese id en este carrito', code: EErrors.BAD_REQUEST });
    };
    cart.products.splice(product, 1);
    return await this.dao.update(cid, cart);
  };

  updateProducts = async (cid, body) => {
    const cart = await this.dao.getById(cid);
    cart.products = body;
    return await this.dao.update(cid, cart);
  };

  updateQuantity = async (cid, pid, quantity) => {
    const cart = await this.dao.getById(cid);
    const product = cart.products.find(p => p.product == pid);
    if (!product) {
      CustomError.createError({ name: 'error', message: 'No hay ningún producto con ese id en este carrito', code: EErrors.BAD_REQUEST });
    };
    
    if (!quantity) {
      CustomError.createError({ name: 'error', message: 'La propiedad ingresada no es válida. Debes seguir el formato.', code: EErrors.BAD_REQUEST });         
    };
    product.quantity = quantity;
    return await this.dao.update(cid, cart);
  };

  clearProducts = async (cid) => {
    const cart = await this.dao.getById(cid);
    cart.products = [];
    return await this.dao.update(cid, cart);
  };

  purchase = async (cid, user) => {
    const unavailableProducts = [];
    const purchasedProducts = [];
    let total = 0;
    const cart = await this.dao.getById(cid);
    if (cart.products.length == 0) {
      CustomError.createError({ name: 'error', message: 'El carrito está vacío.', code: EErrors.BAD_REQUEST });         
    };
    for (let i = 0; i < cart.products.length; i++) {
      let pid = cart.products[i].product.toString();
      let product = await productService.getById(pid);
      let productCart = cart.products[i];
      if (product.stock < productCart.quantity) {
        unavailableProducts.push(productCart);
      } else {
        product.stock -= productCart.quantity;
        total += product.price * productCart.quantity;
        purchasedProducts.push(productCart);
        await productService.update(pid, { stock: product.stock });
      };
    };
    cart.products = unavailableProducts;
    await this.dao.update(cid, cart);
    const tickets = await ticketModel.find();
    if (purchasedProducts.length !== 0) {
      let newTicket;
      if (tickets.length === 0) {
        newTicket = await ticketModel.create({ code: '1', purchase_datetime: Date.now(), amount: total, purchaser: user.first_name });
      } else {
        const lastCode = tickets[tickets.length - 1].code;
        const newCode = (parseInt(lastCode) + 1);
        newTicket = await ticketModel.create({ code: newCode, purchase_datetime: Date.now(), amount: total, purchaser: user.first_name });
      };
      const html = `
        <h1>¡Compra realizada con éxito!</h1><br>
        <p>Hola ${newTicket.purchaser}, tenemos el agrado de comunicarnos con usted para informarle que su proceso de compra se ha realizado con exito. A continuación te adjuntamos los datos correspondientes a su compra:</p>
        <p>Horario realizada la compra: ${newTicket.purchase_datetime}<p>
        <p>Código del ticket: ${newTicket.code}<p>
        <p>Importe total: $${newTicket.amount}</p><br>
        <h2>¡Gracias por elegirnos!</h2>`;
      await userService.sendMail(user.email, 'Ticket de compra realizado', html);
      return {
        ticket: newTicket,
        newCart: cart,
        unavailable_products: unavailableProducts
      };
    } else {
      return {
        status: 'error',
        message: 'No hay stock suficiente.',
        unavailabl_products: unavailableProducts
      };
    };
  };
}