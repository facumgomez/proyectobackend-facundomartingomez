import CustomError from '../services/errors/CustomError.js';
import EErrors from '../services/errors/enums.js';
import { userService } from '../services/repository.js';
import UserDTO from './dto/userDTO.js';
import userModel from './models/userModel.js';

export default class UsersDao {
  constructor() {
    this.model = userModel;
  };

  getAll = async (query) => {
    if (!query) {
      const users = await this.model.find();
      const result = users.map(element => {
        const { _id, first_name, last_name, email, role } = element;
        const user = new UserDTO({ _id, first_name, last_name, email, role });
        return user;
      });
      return result;
    };
    return await this.model.find(query);
  };

  getById = async (uid) => {
    const user = await this.model.findOne({ _id: uid });
    if (!user) {
      CustomError.createError({ name: 'error', message: 'No hay ningún carrito con ese id.', code: EErrors.BAD_REQUEST });
    };
    return user;
  };

  create = async () => {
    return await this.model.create({});
  };

  update = async (uid, userUpdate) => {
    return await this.model.findOneAndUpdate({ _id: uid }, userUpdate, { new: true });
  };

  delete = async (uid) => {
    const user = await this.model.findOne({ _id: uid });
    if (user.role == 'admin') {
      CustomError.createError({ name: 'No autorizado', message: 'No tienes todos los permisos necesarios para hacer esto.', code: EErrors.UNAUTHORIZED });
    };
    const html = `
      <h1>Tu cuenta ha sido eliminada</h1><br>
      <p>Hola ${user.first_name}, nos comunicamos para informarte que tu cuenta ha sido eliminada por un administrador.<p>`
    await userService.sendMail(user.email, 'Eliminación de cuenta', html);
    return await this.model.deleteOne({ _id: uid });
  }; 

  deleteAll = async () => {
    const erase = new Date();
    erase.setDate(erase.getDate() - 2);
    return await this.model.deleteAll({ last_connection: { $lt: erase }});
  };
}