import { productService } from '../services/repository.js';

export const getProducts = async (req, res, next) => {
  try {
    req.query.controller = 'api';
    const products = await productService.getAll(req.query);
    return res.status(200).json({ status: 'success', paylodad: products });
  } catch (error) {
    next(error);
  };
};

export const getProductById = async (req, res, next) => {
  try {
    const { pid } = req.params;
    const product = await productService.getById(pid);
    return res.status(200).json({ status: 'success', paylodad: product });
  } catch (error) {
    next(error);
  };
};

export const createProduct = async (req, res, next) => {
  try {
    const product = req.body;
    if (req.user?.role == 'premium') product.owner = req.user._id;
    const productCreated = await productService.create(product);
    return res.status(200).json({ status: 'success', message: 'Producto creado!', paylodad: productCreated });
  } catch (error) {
    next(error);
  };
};

export const updateProduct = async (req, res, next)  => {
  try {
    const { pid } = req.params;
    const productUpdate = req.body;
    const product = await productService.update(pid, productUpdate);
    return res.status(200).json({ status: 'success', message: 'Producto actualizado!', paylodad: product });
  } catch (error) {
    next(error);
  };
};

export const deleteProduct = async (req, res, next)  => {
  try {
    const { pid } = req.params;
    const user = req.user;
    const productDeleted = await productService.delete(pid, user);
    return res.status(200).json({ status: 'success', message: 'Producto eliminado!', productDeleted });
  } catch (error) {
    next(error);
  };
};

export const getMockingProducts  = async (req, res, next) => {
  try {
    const products = productService.generateMock();
    return res.status(200).json({ status: 'success', payload: products });
  } catch (error) {
    next(error);
  };
};