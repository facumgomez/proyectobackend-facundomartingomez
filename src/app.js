import express  from "express";
import ProdcutManager from "./productManager.js";

const app = express();
const port = 8080;
const products = new ProdcutManager();

app.get('/products', (req, res) => {
  let {limit} = req.query;
  return res.json({products: products.getProducts(limit)});

});

app.get('/products/:pid', (req, res) => {
  let {pid} = req.params;
  return res.json({product: products.getProductById(Number (pid))});
});

app.listen(port, () => { 
  console.log(`Corriendo aplicacion en el puerto ${port}`);
});