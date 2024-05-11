import { Router } from 'express';

const router = Router();

router.get('/', async (req,res) => {
  return res.redirect('/login');
});

router.get('/realtimeproducts', (req,res) => {
  return res.render('realTimeProducts', {style: 'style.css'});
});

router.get('/chat', (req,res) => {
  return res.render('chat', {style: 'chat.css'});
});

export default router;