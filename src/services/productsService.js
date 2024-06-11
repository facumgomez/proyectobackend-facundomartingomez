import ProductsMemoryDao from '../dao/productsMemoryDao.js';

export default class ProductsService {
  constructor() {
    this.productsMemoryDao = new ProductsMemoryDao();
  };

  getProducts = async () => {
    return await this.productsMemoryDao.getAll();
  };

  getProductsPaginate = async (query, page, limit, sort, controllerType) => {
    let sortBy = null;
    if(sort === 'desc') sortBy = {price: -1};
    if(sort === 'asc') sortBy = {price: 1};

    let type = '';
    if(controllerType == 'api') type = 'api/products';
    if(controllerType == 'view') type = 'products';

    let products = await this.productsMemoryDao.getAll(query, page, limit, sort, sortBy);
    products.prevLink = products.hasPrevPage ? `http://localhost:8080/${type}?page=${products.prevPage}&limit=${limit}&sort=${sort}` : '';
    products.nextLink = products.hasNextPage ? `http://localhost:8080/${type}?page=${products.nextPage}&limit=${limit}&sort=${sort}` : '';
    return products
  };

  getProductById = async (pid) => {
    return await this.productsMemoryDao.getById(pid);
  };

  createProduct = async (newProduct) => {
    let products = await this.productsMemoryDao.getAll();
    if (products.find(e => e.code === newProduct.code)) 
      return null;
    let product = await this.productsMemoryDao.create(newProduct);
      return product;
  };

  updateProduct = async (pid, productToUpdate) => {
    const product = await this.productsMemoryDao.update(pid, productToUpdate);
    return product;
  };

  deleteProduct = async (pid) => {
    return await this.productsMemoryDao.delete(pid);
  };
}