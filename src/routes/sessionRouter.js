import { Router } from 'express';
import passport from 'passport';
import userModel from '../dao/models/userModel.js';
import { JWT_COOKIE_NAME } from '../config/credentials.js';

const router = Router();

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/api/sessions/register', passport.authenticate('register', {failureRedirect: '/failRegister'}), async (req, res) => {
  res.redirect('/login');
});

router.get('/failRegister', (req, res) => {
  res.send({error: 'failRegister'});
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/api/sessions/login', passport.authenticate('login', {failureRedirect: '/session/failLogin'}), async (req, res) => {
  if(!req.user) {
    return res.status(400).send({status: 'error', error: 'Credenciales no válidas'});
  };
  res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/products');
});

router.get('/failLogin', (req, res) => {
  res.send({ error: 'Inicio de sesión fallido'});
});

router.get('/api/sessions/logout', (req, res) => {
  res.clearCookie(JWT_COOKIE_NAME).redirect('/login');
});

router.get('/api/sessions/github', passport.authenticate('github', { scope: ['user: email']}), (req, res) => {});

router.get('/api/sessions/callbackGithub', passport.authenticate('github', { failureRedirect: '/login'}), async (req, res) => {
  res.cookie(JWT_COOKIE_NAME, req.user.token).redirect('/products');
});

router.get('api/sessions/current', async (req, res) => {
  try{
    console.log(req.user);
    const uid = req.user._id;
    const user = await userModel.find({_id: uid}).populate('cart');
    if (!user) 
      return res.status(400).json({ status: "error", message: 'Ningún usuario inició sesión'});
    res.status(200).json({user});
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message});
  };
});

export default router;