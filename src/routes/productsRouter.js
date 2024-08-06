import { Router } from 'express';
import { createProduct, deleteProduct, getProducts, getProductById, updateProduct } from '../controller/productsController.js';

const router = Router();

router.get('/', getProducts);
router.get('/:pid', getProductById);
router.post('/', createProduct);
router.put('/:pid', updateProduct);
router.delete('/:pid', deleteProduct);

export default router;