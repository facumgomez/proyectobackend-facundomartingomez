import EErrors from '../errors/enums.js';
import CustomError from '../errors/CustomError.js';
import { generateErrorInfo } from '../errors/info.js';

export default class ProductsRepository {
  constructor(dao) {
    this.dao = dao;
  };

  getProducts = async () => {
    return await this.dao.getAll();
  };

  getProductsPaginate = async (query, page, limit, sort, controllerType) => {
    let sortBy = null;
    if(sort === 'desc') sortBy = {price: -1};
    if(sort === 'asc') sortBy = {price: 1};

    let type = '';
    if(controllerType == 'api') type = 'api/products';
    if(controllerType == 'view') type = 'products';

    let products = await this.dao.getAll(query, page, limit, sort, sortBy);
    products.prevLink = products.hasPrevPage ? `http://localhost:8080/${type}?page=${products.prevPage}&limit=${limit}&sort=${sort}` : '';
    products.nextLink = products.hasNextPage ? `http://localhost:8080/${type}?page=${products.nextPage}&limit=${limit}&sort=${sort}` : '';
    return products
  };

  getProductById = async (pid) => {
    return await this.dao.getById(pid);
  };

  createProduct = async (newProduct) => {
    if (!newProduct.title || !newProduct.category || !newProduct.thumbnail || !newProduct.description || !newProduct.price || !newProduct.code || !newProduct.stock || !newProduct.status) {
      return CustomError.createError({
        name: 'Error al crear el producto',
        cause: generateErrorInfo(newProduct),
        message: 'Error al intentar crear un producto',
        code: EErrors.INVALID_TYPES_ERROR
    });
  };
    let product = await this.dao.create(newProduct);
    return product;
  };

  updateProduct = async (pid, productUpdate) => {
    const product = await this.dao.update(pid, productUpdate);
    return product;
  };

  deleteProduct = async (pid) => {
    return await this.dao.delete(pid);
  };
}