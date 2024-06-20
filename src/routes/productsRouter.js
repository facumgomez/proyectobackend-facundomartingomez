import { Router } from 'express';
import { createProduct, deleteProduct, getProducts, getProductById, updateProduct } from '../controller/productsController.js';
import { isAdmin } from '../middleware/auth.js';

const router = Router();

router.get('/', getProducts);
router.get('/:pid', getProductById);
router.post('/', isAdmin, createProduct);
router.put('/:pid', isAdmin, updateProduct);
router.delete('/:pid', isAdmin, deleteProduct);

export default router;