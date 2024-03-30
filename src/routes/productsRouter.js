import { Router } from "express";
import ProductManager from "../dao/productManager.js";

const router = Router();
const products = new ProductManager();

router.get('/', (req, res) => {
  let {limit} = req.query;
  return res.json({products: products.getProducts(limit)});
});

router.get('/:pid', (req, res) => {
  let {pid=Number(pid)} = req.params;
  return res.json({product: products.getProductById(pid)});
});

router.post('/', (req, res) => {
  let {title, category, description, price, thumbnail, code, stock, status} = req.body;
  let message = products.addProduct (title, category, thumbnail, description, price, code, stock, status);
  return res.json({message});
});

router.put('/:pid', (req, res) => {
  let {pid=Number(pid)} = req.params;
  let message = products.updateProduct(pid, req.body);
  return res.json({message});
});

router.delete('/:pid', (req, res) => {
  let {pid=Number(pid)} = req.params;
  let message = products.deleteProduct(pid);
  return res.json({message});
});

export default router;