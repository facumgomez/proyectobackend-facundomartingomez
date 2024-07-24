import { JWT_COOKIE_NAME } from '../config/credentials.js';
import userModel from '../dao/models/userModel.js';
import UserDTO from '../dao/dto/userDTO.js';
import { userService } from '../services/repository.js';
import logger from '../logger.js';
import { createPassword, isValidPassword } from '../utlis.js';

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
  res.render('sessions/login');
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

export const changePasswordViews = (req, res) => {
  res.render('sessions/changePassword');
};

export const changePassword = async (req, res) =>{
  try {
    const email = req.body.email;
    let user = await userModel.findOne({email: email});
    if (!user) return res.status(401).render('error', {
      error: 'No existe ningún usuario con ese email.'   
    });

    let subject = 'Cambio de contraseña.'
    let web = `<h1>Ha solicitado un restablecimiento de su contraseña, haga click en el botón para continuar.</h1><br><a href="http://localhost:8080/setPassword"><button>Restablecer contraseña</button></a>`;
    const result = await userService.sendMail(email, subject, web);
    logger.info(JSON.stringify(result));
    res.redirect('/login')
  } catch (error) {
    logger.error(error);
  };
};

export const setNewPasswordViews = async (req, res) => {
  try {
    res.render('sessions/setNewPassword');
  } catch (error) {
    logger.error(error);
  }
}

export const setNewPassword = async (req, res) => {
  try {
    const email = req.body.email;
    const newPassword = req.body.password;
    let user = await userModel.findOne({email: email});

    if(!user) return res.status(401).render('error', { error: 'No existe ningún usuario con ese email.' });
    if(isValidPassword(user, newPassword)) 
      return res.status(401).render('error', { error: 'No se puede cambiar la contraseña, es igual a la anterior.' });
    console.log(user);

    user.password = createPassword(newPassword);
    await userModel.findOneAndUpdate({ _id: user._id }, user);
    console.log(user);
    res.redirect('/passwordChanged');
  } catch (error) {
    console.log(error);
  };
};

export const passwordChangedViews = async (req, res) => {
  try {
    res.render('sessions/passwordChanged');
  } catch (error) {
    console.log(error);
  };
};