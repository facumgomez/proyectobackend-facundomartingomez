import { Router } from 'express';
import productModel from '../dao/models/productModel.js';
import cartModel from '../dao/models/cartModel.js';

const router = Router();

router.get('/', async (req,res) => {
  const product = await productModel.find().lean().exec();
  return res.render('home', {product, style: 'style.css'});
});

router.get('/realtimeproducts', (req,res) => {
  return res.render('realTimeProducts', {style: 'style.css'});
});

router.get('/chat', (req,res) => {
  return res.render('chat', {style: 'chat.css'});
});

router.get('/products', async (req, res) =>{
  let page = parseInt(req.query.page);
  if(!page) page = 1;

  let limit = parseInt(req.query.limit);
  if(!limit) limit = 10;

  let sort = req.query.sort;
  let sortBy = null;
  if(sort === 'desc') sortBy = {price: -1};
  if(sort === 'asc') sortBy = {price: 1};

  let query = {};
  if(req.query.category || req.query.status) query = req.query;

  const products = await productModel.paginate(query, { page, limit, sort: sortBy, lean: true});
  products.prevLink = products.hasPrevPage ? `http://localhost:8080/products?page=${products.prevPage}` : ''
  products.nextLink = products.hasNextPage ? `http://localhost:8080/products?page=${products.nextPage}` : ''

  res.render('products', products);
});

router.get('/:cid', async (req, res) =>{
  const { cid } = req.params
    if (cid.match(/^[0-9a-fA-F]{24}$/)) {
      const cart = await cartModel.findOne({_id: cid}).lean().exec()
      if (!cart){
        res.status(400).json({ status: "error", message: 'Carrito no encontrado'});
      } else {
        res.render('cart', {title: 'Carrito', cart})};
    } else {
      res.status(400).json({ status: "error", message: `Carrrito no encontrado con id ${cid}`})   
    };
  });
export default router;