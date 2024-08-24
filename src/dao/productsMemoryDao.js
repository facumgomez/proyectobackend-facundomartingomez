import CustomError from '../services/errors/CustomError.js';
import EErrors from '../services/errors/enums.js';
import { userService } from '../services/repository.js';
import productModel from './models/productModel.js';

export default class ProductsMemoryDao {
  constructor() {
    this.model = productModel;
  };

  getAll = async (params) => {
    if (!params) return await this.model.find();
    const { limit = 10, page = 1, controller, sort } = params;

    let price;
    if (sort === 'desc') price = { price: -1 };
    if (sort === 'asc') price = { price: 1 };

    let type;
    if (controller == 'api') type = 'api/products';
    if (controller == 'view') type = 'products';

    let query = {};
    if (params.category) query = { category: params.category };

    let products =  await this.model.paginate(query, { page, limit, sort: price, lean: true });
    products.prevLink = products.hasPrevPage ? `http://localhost:8080/${type}?page=${products.prevPage}&limit=${limit}&sort=${sort}` : ''
    products.nextLink = products.hasNextPage ? `http://localhost:8080/${type}?page=${products.nextPage}&limit=${limit}&sort=${sort}` : ''

    if (products.docs.length === 0) {
      CustomError.createError({ name: 'bad', message: 'No hay productos disponibles para mostrar.', code: EErrors.BAD_REQUEST });
    };
    return products;
  };

  getById = async (pid) => {
    const product =  await this.model.findOne({ _id: pid }).lean();
    if (!product) {
      CustomError.createError({ name: 'error', message: 'No existe ningún producto con ese id.', code: EErrors.BAD_REQUEST });
    };
    return product;
  };

  create = async (newProduct) => {
    const { title, category, thumbnail, description, price, code, stock, status } = newProduct;
    if (!title || !category || !thumbnail || !description || !price || !code || !stock || !status ) {
      CustomError.createError({ name: 'Error al crear el producto', message: 'Propiedades incompletas o no validas', code: EErrors.CONFLICT });        
    };

    const repeatedCode = await this.model.findOne({ code: code });
    if (code == repeatedCode?.code) {
      CustomError.createError({ name: 'Error de código repetido', message: `Codigo ${code} ya esta en uso`, code: EErrors.CONFLICT }); 
    };
    return await this.model.create(newProduct);
  };

  update = async (pid, productUpdate) => {
    const product =  await this.model.findOne({ _id: pid });
    if (!product) {
      CustomError.createError({ name: 'error', message: 'No existe ningún producto con ese id.', code: EErrors.BAD_REQUEST });
    };

    const productUpdateKeys = Object.keys(productUpdate);
    const productsProperties = ['title', 'category', 'thumbnail', 'description', 'price', 'stock', 'status'];
    productUpdateKeys.forEach(key => {
      const found = productsProperties.find(propertie => propertie == key);
      if (!found) {
        CustomError.createError({ name: 'error', message: 'Propiedades no validas', code: EErrors.BAD_REQUEST });
      };
    });
    return await this.model.findOneAndUpdate({ _id: pid }, productUpdate, { new: true });
  };

  delete = async (pid, user) => {
    const product =  await this.model.findOne({ _id: pid }).lean()
    if (user.role == 'premium' && product.owner != user._id) {
      CustomError.createError({ name: 'No autorizado', message: 'No tienes los permisos necesarios para hacer esto.', code: EErrors.UNAUTHORIZED });
    }; 

    const productDeleted = await this.model.deleteOne({ _id: pid });
    if (productDeleted.deletedCount === 0) {
      CustomError.createError({ name: 'error', message: 'No existe ningún producto con ese id.', code: EErrors.BAD_REQUEST });    
    };

    if (product.owner !== 'admin') {
      const owner = await userService.getById({ _id: product.owner });
      if (owner.role == 'premium') {
        const html = `
        <h1>Tu producto ha sido eliminado</h1><br>
        <p>Hola ${owner.first_name}, nos comunicamos para informarte que tu producto '${product.title}' con el código ${product.code} ha sido eliminado.<p>`
        await userService.sendMail(owner.email, 'Eliminación de producto', html);
      };
    };
    return productDeleted;
  };
}