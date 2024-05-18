import passport from 'passport';
import local from 'passport-local';
import GithubStrategy from 'passport-github2';
import userModel from '../dao/models/userModel.js';
import { createPassword, isValidPassword } from '../utlis.js';

const LocalStrategy = local.Strategy
const initializePassport = () => {
  passport.use('register', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email'
  }, async (req, username, password, done) => {
    const { first_name, last_name, email, age } = req.body;
    try {
      const user = await userModel.findOne({ email: username });
      if (user) {
        console.log('El usuario ya existe');
        return done(null, false);
      };
      const newUser = {
        first_name,
        last_name,
        email,
        age,
        password: createPassword(password)
      };
      const result = await userModel.create(newUser);
      return done(null, result);
    } catch(error) {
      return done(error)
    };
  }));

  passport.use('login', new LocalStrategy({
    usernameField: 'email'
  }, async (username, password, done) => {
    try {
      const user = await userModel.findOne({ email: username});
      if(!user) {
        console.log('Usuario no encontrado');
        return done(null, user);
      };
      if(!isValidPassword(user, password)) return done(null, false)
        return done(null, user)
    } catch (error) {

    };
  }));

  passport.use('github', new GithubStrategy({
    clientID: '',
    clientSecret: '',
    callbackURL: 'http://localhost:8080/api/sessions/callbackGithub'
  }, async (tokenAccess, tokenRefresh, profile, done) => {
    try {
      console.log(profile);
      const user = await userModel.findOne({ email: profile._json.email});
      if(user) {
        return done(null, user);
      };

      const newUser = await userModel.create({
        first_name: profile._json.name,
        last_name: '',
        email: profile._json.email,
        age: '',
        password: ''
      });
      return done(null, newUser);
    } catch (error) {
      return console.log(error);
    };
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