import { Router } from 'express';
import productModel from '../dao/models/productModel.js';

const router = Router();

router.get('/', async (req, res) => {
  const limit = req.query?.limit || 10;
  const page = req.query?.page || 1;

  let query = {};
  if (req.query.category || req.query.status) query = req.query;

  let sort = req.query.sort;
  let sortBy = null;
  if (sort === 'desc') sortBy = { price: -1 };
  if (sort === 'asc') sortBy = { price: 1 };

  const products = await productModel.paginate(query, { page, limit, sort: sortBy, lean: true });

  products.prevLink = products.hasPrevPage ? `http://localhost:8080/api/products?page=${products.prevPage}&limit=${limit}&sort=${sort}` : null;
  products.nextLink = products.hasNextPage ? `http://localhost:8080/api/products?page=${products.nextPage}&limit=${limit}&sort=${sort}` : null;
  
  const user = req.user.user;
  if(products.totalDocs === 0){
    res.render('errors/base', {error: 'No se encontraron productos'});
  } else {
    res.render('products', { products, user, title: 'Productos'});
  };
});

export default router;