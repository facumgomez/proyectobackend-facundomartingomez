import { Router } from 'express';
import { createProduct, deleteProduct, getProducts, getProductById, updateProduct } from '../controller/productsController.js';
import { isAdmin, isPremium } from '../middlewares/auth.js';

const router = Router();

router.get('/', isPremium, getProducts);
router.get('/:pid', getProductById);
router.post('/', isAdmin, isPremium, createProduct);
router.put('/:pid', isAdmin, updateProduct);
router.delete('/:pid', isAdmin, isPremium, deleteProduct);

export default router;