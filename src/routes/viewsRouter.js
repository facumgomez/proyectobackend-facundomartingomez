import { Router } from 'express';
import ProductManager from '../dao/productManager.js';

const router = Router();
const products = new ProductManager();

router.get('/', (req,res) => {
  const product = products.getProducts();
  return res.render('home', {product, style: 'style.css'});
});

router.get('/realtimeproducts', (req,res) => {
  return res.render('realTimeProducts', {style: 'style.css'});
});

export default router;