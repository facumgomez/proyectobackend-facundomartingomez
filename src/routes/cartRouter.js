import { Router } from "express";
import CartManager from "../dao/cartManager.js";

const router = Router();
const cart = new CartManager();

router.get('/:cid', (req,res) => {
  let {cid = Number(cid)} = req.params;
  let message = cart.getCartById(cid);
  return res.json({message});
});

router.post('/', (req, res) => {
  let message = cart.addCart();
  return res.json({message});
});

router.post('/:cid/products/:pid', (req, res) => {
  let {cid = Number(cid), pid = Number(pid)} = req.params;
  const message = cart.addProductInCart(cid, pid);
  return res.json({message});
});

export default router;