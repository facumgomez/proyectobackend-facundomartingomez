import productModel from './models/productModel.js';

export default class ProductsMemoryDao {
  constructor() {
    this.model = productModel;
  };

  getAll = async(query, page, limit, sort, sortBy) => {
    if (!query) {
      let result = await this.model.find();
      return result;
    } else {
      let result = await this.model.paginate(query, {page, limit, sort: sortBy, lean: true});
      return result;
    };
  };

  getById = async(pid) => {
    let result = await this.model.findOne({_id: pid});
    return result;
  };

  create = async (newProduct) => {
    const result = await this.model.create(newProduct);
    return result;
  };

  update = async (pid, productToUpdate) => {
    const result = await this.model.findOneAndUpdate({ _id: pid}, productToUpdate);
    return result;
  };

  delete = async (pid) => {
    const result = await this.model.deleteOne({_id: pid});
    return result;
  };
}