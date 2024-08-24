import Email from '../../helpers/email.js';
import CustomError from '../errors/CustomError.js';
import EErrors from '../errors/enums.js';
import GenericRepository from './genericRepository.js';

export default class UsersRepository extends GenericRepository {
  constructor(dao) { 
    super(dao);
    this.email = new Email();
  };

  deleteAll = async () => {
    const erase = new Date();
    erase.setDate(erase.getDate() - 2);
    const users = await this.dao.getAll({ last_connection: { $lt: erase } });
    if (users.length == 0) {
      CustomError.createError({ name: 'extraviado', message: 'No hay usuarios que cumplan los requisitos', code: EErrors.BAD_REQUEST });      
    };
    users.forEach(user => {
      const html = `
        <h1>Su cuenta ha sido eliminada</h1><br>
        <p>Hola ${user.first_name}, nos comunicamos contigo para informarle que debido al estar inactiva su cuenta ha sido eliminada.<p>`;
      this.email.send(user.email, 'Eliminación de cuenta', html);
    });
    return await this.dao.deleteAll();
  };

  sendMail = async (user, subject, html) => {
    return this.email.send(user, subject, html);
  };

  changeRole = async (uid) => {
    const user = await this.dao.getById(uid);
    if (user.role == 'premium') {
      user.role = 'user';
      return await this.dao.update(uid, user);
    };

    const identification = user.documents.identification.status;
    const domicile = user.documents.domicile.status;
    const acc_status = user.documents.acc_status.status;
    if (user.role == 'user' && (identification == false || domicile == false || acc_status == false)) {
      CustomError.createError({ name: 'Solicitud incorrecta', message: 'No tienes todos los archivos para hacerte premium.', code: EErrors.BAD_REQUEST });
    };
    user.role = 'premium';
    return await this.dao.update(uid, user);       
  };

  adminChangeRole = async (uid) => {
    const user = await this.dao.getById(uid);
    if (user.role == 'admin') {
      CustomError.createError({ name: 'No autorizado', message: 'No tienes todos los permisos para hacer esto.', code: EErrors.UNAUTHORIZED });  
    };
    user.role == 'premium' ? user.role = 'user' : user.role = 'premium';
    return await this.dao.update(uid, user);       
  };

  uploadFiles = async (files, uid) => {
    const filesProps = Object.keys(files);
    if (filesProps.length == 0) {
      CustomError.createError({ name: 'Error al subir los archivos.', message: 'No tienes seleccionado ningun archivo para subir.', code: EErrors.BAD_REQUEST });
    };

    const user = await this.dao.getById(uid);
    if (files.profile) { 
      user.documents.profile_pic = { status: true, name: 'profile-pic', reference: files.profile[0].path };
    };

    if (files.identification) {
      user.documents.identification = { status: true, name: 'identification', reference: files.identification[0].path };
    };

    if (files.domicile) {
      user.documents.domicile = { status: true, name: 'domicile', reference: files.domicile[0].path };
    };

    if (files.accStatus) {
      user.documents.acc_status = { status: true, name: 'acc-status', reference: files.accStatus[0].path };
    };
    await this.dao.update(uid, user);
  };

  deleteFiles = async (uid) => {
    const user = await this.dao.getById(uid);
    const docs = {
      profile_pic: { status: false, name: '', reference: '' },
      identification: { status: false, name: '', reference: '' },
      domicile: { status: false, name: '', reference: '' },
      acc_status: { status: false, name: '', reference: '' }
    };
    user.documents = docs;
    await this.dao.update(uid, user);
  };
}