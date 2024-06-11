import { Router } from 'express';
import { addProductInCart, createCart, deleteCart, deleteCartProduct, deleteCartProducts, getCartById, getCarts, updateCartProducts, updateProductQuantity } from '../controller/cartsController.js';

const router = Router();

router.get('/', getCarts);
router.get('/:cid', getCartById);
router.post('/', createCart);
router.post('/:cid/products/:pid', addProductInCart);
router.put('/:cid', updateCartProducts);
router.put('/:cid/products/:pid', updateProductQuantity);
router.delete('/:cid/products/:pid', deleteCartProduct);
router.delete('/:cid', deleteCartProducts);
router.delete('/cart/:cid', deleteCart);

export default router;