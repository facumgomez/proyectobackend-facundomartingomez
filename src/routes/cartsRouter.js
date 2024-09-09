import { Router } from 'express';
import { addProduct, createCart, deleteProduct, deleteProducts, getCart, purchaseCart, updateProducts, updateQuantity } from '../controller/cartsController.js';
import { passportCall } from '../middlewares/passportCall.js';

const router = Router();

router.get('/:cid', getCart);
router.post('/', createCart);
router.post('/:cid/product/:pid', passportCall('jwt', 'premiumOrUser'), addProduct);
router.post('/:cid/purchase', passportCall('jwt', 'user'), purchaseCart);
router.put('/:cid', passportCall('jwt', 'user'), updateProducts);
router.put('/:cid/products/:pid', passportCall('jwt', 'user'), updateQuantity);
router.delete('/:cid/products/:pid', passportCall('jwt', 'user'), deleteProduct);
router.delete('/:cid', passportCall('jwt', 'user'), deleteProducts);

export default router; 