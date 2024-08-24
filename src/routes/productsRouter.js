import { Router } from 'express';
import { createProduct, deleteProduct, getMockingProducts, getProductById, getProducts, updateProduct } from '../controller/productsController.js';
import { passportCall } from '../middlewares/passportCall.js';

const router = Router();

router.get('/', getProducts);
router.get('/:pid', getProductById);
router.get('/mockingProducts', getMockingProducts);
router.post('/', passportCall('jwt', 'premiumOrAdmin'), createProduct);
router.put('/:pid', passportCall('jwt', 'admin'), updateProduct);
router.delete('/:pid', passportCall('jwt', 'premiumOrAdmin'), deleteProduct);

export default router;