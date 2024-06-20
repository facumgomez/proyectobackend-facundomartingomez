import { JWT_COOKIE_NAME } from '../config/credentials.js';
import userModel from '../dao/models/userModel.js';
import UserDTO from '../dao/dto/userDTO.js';

export const getRegisterViews = (req, res) => {
  res.render('register');
};

export const createSession = async (req, res) => {
  res.redirect('/login');
};

export const failRegisterViews = (req, res) => {
  res.status(401).render('error', { error: 'Registro fallido. El usuario ya existe.' });
};

export const loginViews = (req, res) => {
  res.render('login');
};

export const createLogin = async (req, res) => {
  if (!req.user) 
    return res.status(400).send({ status: 'error', error: 'Credenciales inválidas' });
  res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/products');
};

export const failLoginViews = (req, res) => {
  res.status(401).render('error', { error: 'Acceso fallido. Las credenciales no son válidas' });
};

export const closeSession = (req, res) => {
  res.clearCookie(JWT_COOKIE_NAME).redirect('/login');
};

export const createLoginGitHub = async (req, res) => {
  res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/products');
};

export const getCurrentSession = async (req, res) => {
  try {
    const uid = req.user._id;
    const user = await userModel.find({_id: uid}).populate('carts');
    if (!user) 
      return res.status(400).json({ status: 'error', message: 'Ningún usuario inició sesión' });
    let {_id, first_name, last_name, email, age, role} = req.user
    user = new UserDTO({_id, first_name, last_name, email, age, role})
    res.status(200).json({user});
  } catch (error) {
    res.status(400).json({ status: 'error', message: error.message });
  };
};