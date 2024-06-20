import userModel from './models/userModel.js';

export default class UsersDao {
  constructor() {
    this.model = userModel;
  };

  getById = async(uid) => {
    let result = await this.model.findOne({_id: uid}).populate('carts');
    return result;
  };
}