import { cartService } from '../services/repository.js';

export const getCart = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await cartService.getPopulated(cid);
    return res.status(200).json({ status: 'success', payload: cart });
  } catch (error) {
    next(error);
  };
};

export const createCart = async (req, res, next) => {
  try {
    const newCart = await cartService.create();
    return res.status(200).json({ status: 'success', message: 'Carrito creado!', payload: newCart });
  } catch (error) {
    next(error);
  };
};

export const addProduct = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const user = req.user;
    const cart = await cartService.addProduct(cid, pid, user);
    return res.status(200).json({ status: 'success', message: 'Producto actualizado en el carrito.', payload: cart });
  } catch (error) {
    next(error);
  };
};

export const deleteProduct = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartService.deleteProduct(cid, pid);
    return res.status(200).json({ status: 'success', message: 'Producto eliminado del carrito.', payload: cart });
  } catch (error) {
    next(error);
  };
};

export const updateProducts = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const body = req.body;
    const cart = await cartService.updateProducts(cid, body);
    return res.status(200).json({ status: 'success', message: 'Productos actualizados en el carrito!', payload: cart });
  } catch (error) {
    next(error);
  };
};

export const updateQuantity = async (req, res, next) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    const cart = await cartService.updateQuantity(cid, pid, quantity);
    return res.status(200).json({ status: 'success', message: 'Producto actualizado en el carrito!', payload: cart });
  } catch (error) {
    next(error);
  };
};

export const deleteProducts = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const cart = await cartService.clearProducts(cid);
    return res.status(200).json({ status: 'success', message: 'Productos eliminados del carrito.', cart });
  } catch (error) {
    next(error);
  };
};

export const purchaseCart = async (req, res, next) => {
  try {
    const { cid } = req.params;
    const user = req.user;
    const ticket = await cartService.purchase(cid, user);  
    return res.status(200).json({ status: 'success', message: 'Compra existosa!', payload: ticket });
  } catch (error) {
    next(error);
  };
};