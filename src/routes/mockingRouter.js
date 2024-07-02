import { Router } from 'express';
import { generateProducts } from '../utlis.js';

const router = Router();

router.get('/', (req, res) => {
  const products = []
  for (let i = 0; i < 100; i++) {
    products.push(generateProducts());
  };
  res.send({status: 'success', products});
});

export default router;