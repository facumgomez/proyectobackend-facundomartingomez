import { Router } from 'express';
import { createProducts, deleteProduct, getProducts, getProductsById, updateProduct } from '../controller/productsController.js';

const router = Router();

router.get('/', getProducts);
router.get('/:pid', getProductsById);
router.post('/', createProducts);
router.put('/:pid', updateProduct);
router.delete('/:pid', deleteProduct);

export default router;