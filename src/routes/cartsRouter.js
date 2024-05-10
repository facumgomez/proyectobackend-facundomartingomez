import { Router } from 'express';
import { addProductInCart, createCart, deleteCartProduct, deleteCartProducts, getCartById, updateCartProducts, updateProductQuantity } from '../controller/cartsController.js';

const router = Router();

router.get('/:cid', getCartById);
router.post('/', createCart);
router.post('/:cid/products/:pid', addProductInCart);
router.delete('/:cid/products/:pid', deleteCartProduct);
router.put('/:cid', updateCartProducts);
router.put('/:cid/products/:pid', updateProductQuantity);
router.delete('/:cid', deleteCartProducts);

export default router;