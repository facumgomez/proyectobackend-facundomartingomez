import passport from 'passport';
import passport_jwt from 'passport-jwt';
import local from 'passport-local';
import GithubStrategy from 'passport-github2';

import config from './config.js';
import userModel from '../dao/models/userModel.js';
import cartModel from '../dao/models/cartModel.js';
import { createPassword, isValidPassword } from '../helpers/bcrypt.js';
import { generateToken, extractCookie } from '../helpers/jwt.js';
import { JWT_PRIVATE_KEY } from './credentials.js';


const LocalStrategy = local.Strategy;
const JWTStrategy = passport_jwt.Strategy;
const ExtractJWT = passport_jwt.ExtractJwt;

const initializePassport = () => {
  passport.use('register', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email'
  }, async (req, username, password, done) => {
    try {
      const { first_name, last_name, email, age } = req.body;
      const user = await userModel.findOne({ email: username });
      if (user) return done(null, false);
      const cart = await cartModel.create({});
      const newUser = {
        first_name,
        last_name,
        email,
        age,
        password: createPassword(password),
        cart: cart._id,
        last_connection: Date.now(),
        documents: {
          profile_pic: {
            status: false,
            name: '',
            reference: ''
          },
          identification: {
            status: false,
            name: '',
            reference: ''
          },
          domicile: {
            status: false,
            name: '',
            reference: ''
          },
          acc_status: {
            status: false,
            name: '',
            reference: ''
          }
        }
      };

      if (newUser.email == config.ADMIN_EMAIL && isValidPassword(newUser, config.ADMIN_PASSWORD)) newUser.role = 'admin';
      const result = await userModel.create(newUser);
      return done(null, result);
    } catch(error) {
      return done(error);
    };
  }));

  passport.use('login', new LocalStrategy({
    usernameField: 'email'
  }, async (username, password, done) => {
    try {
      const user = await userModel.findOne({ email: username });
      if (!user) return done(null, user);
      if (!isValidPassword(user, password)) return done(null, false);
      user.last_connection = Date.now();
      await userModel.findOneAndUpdate({ email: username }, user);
      const token = generateToken(user);
      user.token = token;
      return done(null, user);
    } catch (error) {
      return done(error);
    };
  }));

  passport.use('github', new GithubStrategy({
    clientID: 'Iv23li3JauvVRA55Znzs',
    clientSecret: '9e7a3c7c19bd54f9426797f18b7ccbd5d42447b0',
    callbackURL: 'http://localhost:8080/api/sessions/callbackGithub'
  }, async (tokenAccess, tokenRefresh, profile, done) => {
    try {
      const user = await userModel.findOne({ email: profile._json.email });
      if (user) {
        const token = generateToken(user);
        user.token = token;
        user.last_connection = Date.now();
        return done(null, user);
      };

      const cart = await cartModel.create({});
      const newUser = await userModel.create({
        first_name: profile._json.name,
        last_name: '',
        email: profile._json.email,
        age: undefined,
        password: '',
        cart: cart._id,
        last_connection: Date.now()
      });
      const userCreated = await userModel.findOne({ email: newUser.email });
      const token = generateToken(userCreated);
      userCreated.token = token;
      return done(null, userCreated);
    } catch (error) {
      return done(error);
    };
  }));

  passport.use('jwt', new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromExtractors([extractCookie]),
    secretOrKey: JWT_PRIVATE_KEY
  }, async (jwt_payload, done) => {
    done(null, jwt_payload);
  }));

  passport.serializeUser((user, done) => {
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    const user = await userModel.findById(id);
    done(null, user);
  });
}

export default initializePassport;