import { cartService } from '../services/repository.js';

export const getCarts = async (req, res) => {
  try {
    const carts = await cartService.getCarts();
    res.status(200).json({ status: 'success', payload: carts });
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  };
};

export const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartService.getCartById(cid);
    if(!cart)
      return res.status(400).json({ status: 'error', message: `Carrito no encontrado con ID ${cid}` });
    res.status(200).json({ status: "success", payload: cart });
  } catch (error) {
    if (error.name === 'ErrorCast') 
      return res.status(400).json({ status: 'error', message: 'No hay ningún carrito con ese ID' });
    res.status(400).json({ status: 'error', message: 'El documento no tiene un formato válido.' });
  };
};

export const createCart = async (req, res) => {
  try {
    const newCart = await cartService.createCart();
    return res.status(200).json({ status: 'success', message: 'Carrito creado', payload: newCart });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'El documento no tiene un formato válido.' });
  };
};

export const addProductInCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartService.addProductInCart(cid, pid);
    if (!cart)
      return res.status(400).json({ status: 'error', message: `Carrito no encontrado con ID ${cid}` });
    res.status(200).json({ status: 'success', message: 'El producto ha sido actualizado en el carrito.', payload: cart });
  } catch (error) {
    if (error.name === 'ErrorCast') 
      return res.status(400).json({ status: 'error', message: 'No hay ningún carrito con ese ID' });
    res.status(400).json({ status: 'error', message: 'El documento no tiene un formato válido.' });
  };
};

export const deleteCartProduct = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartService.deleteCartProduct(cid, pid);
    if (!cart) 
      return res.status(400).json({ status: 'error', message: 'Producto no encontrado' });
    res.status(200).json({ status: 'success', message: 'El producto ha sido actualizado en el carrito.', payload: cart });
  } catch (error) {
    if (error.name === 'ErrorCast') 
      return res.status(400).json({ status: 'error', message: 'No hay ningún carrito con ese ID' });
    res.status (400).json({ status: 'error', message: 'El documento no tiene un formato válido.' });
  };
};

export const updateCartProducts = async (req, res) => {
  try {
    const { cid } = req.params;
    const body = req.body;
    const cart = await cartService.updateCart(cid, body);
    res.status(200).json({ status: 'success', payload: cart });
  } catch (error) {
    if (error.name === 'ErrorCast') 
      return res.status(400).json({ status: 'error', message: 'No hay ningún carrito con ese ID' });
    res.status (400).json({ status: 'error', message: 'El documento no tiene un formato válido.' });
  };
};

export const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const body = req.body.quantity;
    const cart = await cartService.updateQuantity(cid, pid, body);
    if (!cart)
      return res.status(400).json({ status: 'error', message: 'La cantidad se pudo actualizar' });
    res.status(200).json({ status: 'success', message: 'Producto actualizado', payload: cart });
  } catch (error) {
    if (error.name === 'ErrorCast') 
      return res.status(400).json({ status: 'error', message: 'No hay ningún carrito con ese ID' });
    res.status(400).json({ status: 'error', message: 'El documento no tiene un formato válido.' });
  };
};

export const deleteCartProducts = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartService.clearCart(cid);
    if (!cart) 
      return res.status(400).json({ status: 'error', message: 'Carrito no encontrado' });
    res.status(200).json({ status: 'success', message: 'Productos eliminados', cart });
  } catch (error) {
    if (error.name === 'ErrorCast') 
      return res.status(400).json({ status: 'error', message: 'No hay ningún carrito con ese ID' });
    res.status(400).json({ status: 'error', message: 'El documento no tiene un formato válido.' });
  };
};

export const deleteCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartService.deleteCart(cid);
    if (!cart) 
      return res.status(400).json({ status: 'error', message: 'Carrito no encontrado' });
    res.status(200).json({ status: 'success', message: 'Carrito eliminado', cart });
  } catch (error) {
    if (error.name === 'ErrorCast') 
      return res.status(400).json({ status: 'error', message: 'No hay ningún carrito con ese ID' });
    res.status(400).json({ status: 'error', message: 'El documento no tiene un formato válido.' });
  };
};

export const purchaseCart = async (req, res) => {
  try {
    const { cid } = req.params;
    const user = req.user;
    const ticket = await cartService.purchaseComplete(cid, user.first_name);
    if (!ticket)  
      return res.json({ status: 'error', message: 'No se pudo completar la compra' });
    return res.json({ticket});
  } catch (error) {
    if (error.name === 'ErrorCast') 
      return res.status(400).json({ status: 'error', message: 'No hay ningún carrito con ese ID' });
    res.status(400).json({ status: 'error', message: 'El documento no tiene un formato válido.' });
  };
};