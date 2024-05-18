import productModel from '../dao/models/productModel.js';

export const getProducts = async (req, res) => {
  try {
    const limit = req.query?.limit || 10;
    const page = req.query?.page || 1;

    let query = {};
    if (req.query.category || req.query.status) query = req.query;

    let sort = req.query.sort;
    let sortBy = null;
    if (sort === 'desc') sortBy = { price: -1 };
    if (sort === 'asc') sortBy = { price: 1 };

    const products = await productModel.paginate(query, { page, limit, sort: sortBy, lean: true });
    products.prevLink = products.hasPrevPage ? `http://localhost:8080/api/products?page=${products.prevPage}&limit=${limit}&sort=${sort}` : '';
    products.nextLink = products.hasNextPage ? `http://localhost:8080/api/products?page=${products.nextPage}&limit=${limit}&sort=${sort}` : '';

    if (products.totalDocs === 0) {
      res.status(200).json({ status: 'error', products });
    } else {
      res.status(200).json({ status: 'success', products });
    }
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'El documento no tiene un formato válido.' });
  };
};

export const getProductById = async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productModel.findById (pid);
    if (!product)
      return res.status(400).json({ status: 'error', message: `Producto no encontrado con id ${pid}` });
  } catch (error) {
    res.status(200).json({ status: 'error', message:'El documento no tiene un formato válido.' });
  };
};

export const createProduct = async (req, res) => {
  try {
    const newProduct = req.body;
    let products = await productModel.find().lean().exec();
    if (!newProduct.title || !newProduct.category || !newProduct.thumbnail || !newProduct.description || !newProduct.price || !newProduct.code || !newProduct.stock)
      return res.status(400).json({ status:'error', message: 'Producto incompleto' });

    if (products.find(e => e.code === newProduct.code)) 
      return res.status(400).json({ status: "error", message: 'Código no disponible'});

    const product = await productModel.create(newProduct);
    res.status(201).json({ status: "success", message: "Producto creado", product });
  } catch (error) {
    console.log('createProoducts', error);
    return res.status(400).json({ status: 'error', message:'El documento no tiene un formato válido.' });
  };
};

export const updateProduct = async (req, res)  => {
  try {
    const { pid } = req.params;
    const productUpdate = req.body;
    if (!productUpdate.title || !productUpdate.category || !productUpdate.thumbnail || !productUpdate.description || !productUpdate.price || !productUpdate.code || !productUpdate.stock)
      return res.status(400).json({ status: 'error', message: 'Producto no completo' });
    
    const product = await productModel.findByIdAndUpdate({_id: pid}, productUpdate)
      if(product === null)
        return res.status(400).json({ status: 'error', message: `Imposible actualizar producto con id ${pid}` });
      res.status(200).json({ status: "success", message: "Producto actualizado", productUpdate })
  } catch (error) {
    console.log('updateProduct', error);
    return res.status(400).json({ status: 'error', message:'El documento no tiene un formato válido.' });
  };
};

export const deleteProduct = async (req, res)  => {
  try {
    const { pid } = req.params;
    const productDelete = await productModel.findByIdAndDelete(pid);
      if(productDelete)
        return res.status(201).json({ status: 'success', message: 'Producto eliminado', productDelete });
      return res.status(400).json({ status: 'error', message: `Imposible elimanar producto con id ${pid}`});
  } catch (error) {
    console.log('deleteProduct', error);
    return res.status(400).json({ status: 'error', message:'El documento no tiene un formato válido.' });
  };
};