import { Router } from 'express';
import { addProductInCart, createCart, deleteCart, deleteCartProduct, deleteCartProducts, getCartById, getCarts, purchaseCart, updateCartProducts, updateProductQuantity } from '../controller/cartsController.js';
import { isUser } from '../middleware/auth.js';

const router = Router();

router.get('/', getCarts);
router.get('/:cid', getCartById);
router.post('/', createCart);
router.post('/:cid/products/:pid', isUser,addProductInCart);
router.post('/:cid/purchase', purchaseCart);
router.put('/:cid', updateCartProducts);
router.put('/:cid/products/:pid', updateProductQuantity);
router.delete('/:cid/products/:pid', deleteCartProduct);
router.delete('/:cid', deleteCartProducts);
router.delete('/cart/:cid', deleteCart);

export default router;