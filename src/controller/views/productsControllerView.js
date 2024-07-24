import { productService } from '../../services/repository.js';

export const getProductsViews = async (req, res) => {
  try {
    const limit = req.query?.limit || 10;
    const page = req.query?.page || 1;

    let sort = req.query.sort;
    let query = {};
    if (req.query.category || req.query.status) query = req.query;

    let controllerType = 'view';
    let products = await productService.getProductsPaginate(query, page, limit, sort, controllerType);

    const user = req.user.user;
    if(user.role == 'user') {
      user.flag = true;
    };

    if (products.totalDocs === 0) {
      res.render('error', { error: 'No se encontraron productos' });
    } else {
      res.render('products', { products, user, title: 'Productos'});
    };
  } catch (error) {
    res.render('error', { error: 'No se pudo cargar los productos debido a un error.'});
  };
};