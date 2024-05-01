import { Router } from 'express';
import { addProductInCart, createCart, getCartById } from '../controller/cartController.js';

const router = Router();

router.get('/:cid', getCartById);
router.post('/', createCart);
router.post('/:cid/products/:pid', addProductInCart);

export default router;