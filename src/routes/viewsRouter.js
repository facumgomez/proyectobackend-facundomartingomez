import { Router } from 'express';
import { isUser } from '../middlewares/auth.js';

const router = Router();

router.get('/', async (req,res) => {
  return res.redirect('/login');
});

router.get('/realtimeproducts', (req,res) => {
  return res.render('realTimeProducts', {style: 'style.css'});
});

router.get('/chat', isUser, (req,res) => {
  return res.render('chat', {style: 'chat.css'});
});

export default router;