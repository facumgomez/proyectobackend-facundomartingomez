import { userService } from '../services/repository.js';

export const getUsers = async (req, res, next) => {
  try {
    const users = await userService.getAll();
    return res.status(200).json({ status: 'success', payload: users });
  } catch (error) {
    next(error);
  };
};

export const changeRole = async (req, res, next) => {
  try {
    const uid = req.user._id;
    const user = await userService.changeRole(uid);
    return res.status(200).json({ status: 'success', message: 'Rol actualizado!', payload: user });
  } catch (error) {
    next(error);
  };
};

export const adminChangeRole = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const user = await userService.adminChangeRole(uid);
    return res.status(200).json({ status: 'success', message: 'Rol actualizado!', payload: user });
  } catch (error) {
    next(error);
  };
};

export const deleteUsers = async (req, res, next) => {
  try {
    const usersDeleted = await userService.deleteAll();
    return res.status(200).json({ status: 'success', message: 'Usuarios eliminados!', payload: usersDeleted });
  } catch (error) {
    next(error);
  };
};

export const deleteUser = async (req, res, next) => {
  try {
    const { uid } = req.params;
    const userDeleted = await userService.delete(uid);
    return res.status(200).json({ status: 'success', message: 'Usuario eliminado!', payload: userDeleted});
  } catch (error) {
    next(error);
  };
};

export const uploadDocuments = async (req, res, next) => {
  try {
    const files = req.files;
    const uid = req.user._id;
    await userService.uploadFiles(files, uid);
    return res.redirect('/profile');
  } catch (error) {
    return res.render('error', { error: error.message, title: 'Ecommerce | Error', route: 'profile', page: 'Perfil' });
  };
};

export const deleteDocuments = async (req, res, next) => {
  try {
    const uid = req.user._id;
    await userService.deleteFiles(uid);
    return res.status(200).json({ status: 'success', message: 'Los documentos han sido eliminados.' });        
  } catch (error) {
    next(error);
  };
};