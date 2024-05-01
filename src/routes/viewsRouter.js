import { Router } from 'express';
import productModel from '../dao/models/productsModel.js';

const router = Router();

router.get('/', async (req,res) => {
  const product = await productModel.find().lean();
  return res.render('home', {product, style: 'style.css'});
});

router.get('/realtimeproducts', (req,res) => {
  return res.render('realTimeProducts', {style: 'style.css'});
});

router.get('/chat', (req,res) => {
  return res.render('chat', {style: 'chat.css'});
});


export default router;