import { Router } from 'express';
import { addProduct, createCart, deleteProduct, deleteProducts, getCart, purchaseCart, updateProducts, updateQuantity } from '../controller/cartsController.js';
import { passportCall } from '../middlewares/passportCall.js';

const router = Router();

router.get('/:cid', getCart);
router.post('/', createCart);
router.post('/:cid/product/:pid', passportCall('jwt', 'premiumOrUser'), addProduct);
router.post('/:cid/purchase', purchaseCart);
router.put('/:cid', updateProducts);
router.put('/:cid/products/:pid', updateQuantity);
router.delete('/:cid/products/:pid', deleteProduct);
router.delete('/:cid', deleteProducts);

export default router; 