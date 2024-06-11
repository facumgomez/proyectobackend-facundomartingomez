import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_COOKIE_NAME, JWT_PRIVATE_KEY } from './config/credentials.js';
import passport from 'passport';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
export default __dirname;

export const createPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

export const isValidPassword = (user, password) => {
  return bcrypt.compareSync(password, user.password);
};

export const generateToken = user => {
  const token = jwt.sign({user}, JWT_PRIVATE_KEY, {expiresIn: '24h'});
  return token;
};

export const extractCookie = req => {
  return (req && req.cookies) ? req.cookies[JWT_COOKIE_NAME] : null;
};

export const passportCall = (strategy) => {
  return async (req, res, next) => {
    passport.authenticate(strategy, function(err, user, info){
    if(err) 
      return next(err);
    if(!user) 
      return res.status(401).render('error', { error: info.messages? info.messages : info.toString()});
    req.user = user;
    next();
    })(req, res, next);
  };
};