import { JWT_COOKIE_NAME } from '../config/credentials.js';
import UserDTO from '../dao/dto/userDTO.js';

export const createRegister = async (req, res) => {
  return res.status(200).json({ status: 'success', message: 'Usuario registrado exitosamente' });
};

export const createLogin = async (req, res, next) => {
  try {
    if (!req.user) return res.status(400).send({ status: 'error', error: 'Credenciales inválidas!' });
    const token = req.user.token;
    const cart_id = req.user.cart;
    return res.cookie(JWT_COOKIE_NAME, token).status(200).json({ status: 'success', message: 'Inicio de sesión exitoso!', cart_id, token});
  } catch (error) {
    next(error);
  };
};

export const createLoginGitHub = async (req, res) => {
  return res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/products');
};

export const closeSession = (req, res) => {
  return res.clearCookie(JWT_COOKIE_NAME).redirect('/login');
};

export const currentSession = async (req, res, next) => {
  try {
    if (!req.user) return res.status(400).json({ status: 'error', message: 'Ningún usuario inició sesión!' });
    const { _id, first_name, last_name, email, role, documents } = req.user
    const user = new UserDTO({ _id, first_name, last_name, email, role, documents });
    return res.status(200).json({ status: 'success', payload: user});
  } catch (error) {
    next(error);
  };
};