import { Router } from 'express';
import userModel from '../dao/models/userModel.js';

const router = Router();

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/api/sessions/register', async (req, res) => {
  const newUser = req.body;
  const user = new userModel(newUser);
  await user.save();
  res.redirect('/login');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/api/sessions/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email, password }).lean().exec();
  if (!user) {
    return res.status(401).json({ status: 'error', message: `Contraseña o email incorrectos` });
  };

  let role = 'usuario';
  if(user.email == 'adminCoder@coder.com' && user.password == 'adminCod3r123') {
    role = 'admin'
  };

  req.session.user = { ...user, role: role };
  res.redirect('/products');
});

router.get('/api/sessions/logout', (req, res) =>{
  req.session.destroy(error => {
    if(error) {
      return res.status(500).json({ error: error.message });
    } else {
      res.redirect('/login');
    };
  });
});

export default router;