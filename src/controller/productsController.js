import { productService } from '../services/repository.js';
import errorHandler from '../middlewares/error.js'

export const getProducts = async (req, res) => {
  try {
    const limit = req.query?.limit || 10;
    const page = req.query?.page || 1;

    let sort = req.query.sort;
    let query = {};
    if (req.query.category || req.query.status) query = req.query;

    let controllerType = 'api';

    let products = await productService.getProductsPaginate(query, page, limit, sort, controllerType);
    if (products.totalDocs === 0)
      return res.status(400).json({ status: 'error', products });
    res.status(200).json({ status: 'success', paylodad: products });
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'El documento no tiene un formato válido.' });
  };
};

export const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productService.getProductById(pid);
    if (!product)
      return res.status(400).json({ status: 'error', message: `Producto no encontrado con id ${pid}` });
    res.status(200).json({ status: 'success', paylodad: product});
  } catch (error) {
    if (error.name === 'ErrorCast') 
      return res.status(400).json({ status: 'error', message: 'No hay ningún producto con ese ID' });
    res.status(400).json({ status: 'error', message:'El documento no tiene un formato válido.' });
  };
};

export const createProduct = async (req, res) => {
  try {
    const newProduct = req.body;
    if (req.user) { 
      newProduct.owner = req.user._id 
    };
    const productAdd = await productService.createProduct(newProduct);
    res.status(200).json({ status: 'success', message: 'Producto creado', productAdd, paylodad: productAdd });
  } catch (error) {
    errorHandler(error, res)
  };
};

export const updateProduct = async (req, res)  => {
  try {
    const { pid } = req.params;
    const productUpdate = req.body;
    const product = await productService.updateProduct(pid, productUpdate);
    if (product === null)
      return res.status(400).json({ status: 'error', message: 'Producto incompleto' });
    res.status(200).json({ status: 'success', message: 'Producto actualizado', paylodad: productUpdate });
  } catch (error) {
    if (error.name === 'ErrorCast') 
      return res.status(400).json({ status: 'error', message: 'No hay ningún producto con ese ID' });
    res.status(400).json({ status: 'error', message:'El documento no tiene un formato válido.' });
  };
};

export const deleteProduct = async (req, res)  => {
  try {
    const { pid } = req.params;
    const user = req.user;
    if (user.role == 'premium') {
      let product = await productService.getProductById(pid);
      if (product.owner != user._id) {
        return res.status(400).json({ status: 'error', message: 'No puedes eliminar este producto porque no eres el dueño.' });
      };
      const productDeleted = await productService.deleteProduct(pid);
      if (productDeleted.deletedCount === 0)  
        return res.status(400).json({ status: 'error', message: 'Producto no encontrado'});
      res.status(200).json({ status: 'success', massage: 'Producto eliminado', productDeleted });
    };

    const productDelete = await productService.deleteProduct(pid);
    if (productDelete.deleteCount === 0)
      return res.status(400).json({ status: 'error', message: `Imposible elimanar producto con id ${pid}` });
    res.status(200).json({ status: 'success', message: 'Producto eliminado', productDelete });
  } catch (error) {
    if (error.name === 'ErrorCast') 
      return res.status(400).json({ status: 'error', message: 'No hay ningún producto con ese ID' });
    res.status(400).json({ status: 'error', message:'El documento no tiene un formato válido.' });
  };
};