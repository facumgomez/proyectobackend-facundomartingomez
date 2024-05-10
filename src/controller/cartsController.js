import cartModel from "../dao/models/cartModel.js"

const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartModel.findById(cid);
    if(!cart)
      return res.json({cart});
    return res.status(200).json({ status: 'error',message: `Carrito no encontrado con id ${pid}`})
  } catch (error){
    console.log('getCartById', error);
    return res.status(400).json({status: 'error', message:'El documento no tiene un formato válido.'});
  };
};

const createCart = async (req, res) => {
  try {
    const cart = await cartModel.create({});
    return res.json({status: 'success', message: 'Carrito creado', cart})
  } catch (error){
    console.log('addCart', error);
    return res.status(201).json({message:'El documento no tiene un formato válido.'});
  };
};

const addProductInCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartModel.findById(cid);
      if(!cart)
      return res.status(400).json({status: 'error', message: `Carriito no encontrado con id ${cid}`});

    const productInCart = cart.products.find(p => p.id.toString() === pid);
    if (!productInCart)
      productInCart.quantity++;
    else 
      cart.products.push({id:pid, quantity: 1});
    cart.save();
    return res.status(200).json({status: 'success', message: 'Carrito actualizado', cart});
  } catch (error){
    console.log('addProductInCart', error);
    return res.status(400).json({status: 'success', message:'El documento no tiene un formato válido.'});
  };
};

const deleteCartProduct = async (req, res) => {
  try {
    const {cid, pid} = req.params;
    let cart = await cartModel.findById(cid);
    const product = cart.products.find(p => p.product === pid);
    if (product <= 0) 
      return res.status(400).json({ status: "error", message: 'Producto no encontrado'});
    else 
      cart.products.splice(product, 1);
    cartSave();
    res.status(200).json({ status: 'success', cart });
    } catch (error) {
      return res.status (400).json({message:'El documento no tiene un formato válido.'});
  };
};

const updateCartProducts = async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartModel.findById(cid);
    cart.products = req.body;
    cart.save();
    res.status(200).json({ status: "success", cart});
  } catch (error) {
    return res.status (400).json({message:'El documento no tiene un formato válido.'});
  };
};

const updateProductQuantity = async (req, res) => {
  try {
    const {cid, pid} = req.params;
    const cart = await cartModel.findById(cid);
    const product = cart.products.find(p => p.product == pid);
    product.quantity = req.body.quantity
    cart.save()
    res.status(200).json({ status: "success", message: 'Producto actualizado', cart});
  } catch (error) {
    res.status(400).json({ status: "error", message: 'El documento no tiene un formato válido.'});
  };
};

const deleteCartProducts = async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartModel.findById(cid);
    cart.products = [];
    cart.save();
      res.status(200).json({ status: "success", message: 'Productos eliminados', cart});
  } catch (error) {
    res.status(400).json({ status: "error", message: 'El documento no tiene un formato válido.' });
  };
};

export { getCartById, createCart, addProductInCart, deleteCartProduct, updateCartProducts, updateProductQuantity, deleteCartProducts };

