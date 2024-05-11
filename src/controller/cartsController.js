import cartModel from "../dao/models/cartModel.js"

const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartModel.findById(cid);
    if(!cart)
      return res.status(400).json({ status: 'error', message: `Carrito no encontrado con id ${cid}` });
    return res.status(200).json({cart});
  } catch (error) {
    res.status(400).json({ status: 'error', message:'El documento no tiene un formato válido.' });
  };
};

const createCart = async (req, res) => {
  try {
    const newCart = await cartModel.create({});
    return res.status(201).json({ status: 'success', message: 'Carrito creado', newCart });
  } catch (error) {
    res.status(400).json({ status:'error', message:'El documento no tiene un formato válido.'});
  };
};

const addProductInCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartModel.findById(cid);
    if (!cart)
      return res.status(400).json({ status: 'error', message: `Carrito no encontrado con id ${cid}` });

    const productInCart = cart.products.find(p => p._id.toString() === pid);
    if (!productInCart) {
      cart.products.push({ _id: pid, quantity: 1 });
      await cart.save(); 
      return res.status(200).json({ status: 'success', message: 'Carrito actualizado', cart });
    } else {
      productInCart.quantity++;
      await cart.save(); 
      return res.status(200).json({ status: 'success', message: 'Cantidad actualizada', cart });
    };
  } catch (error) {
    res.status(400).json({ status: 'error', message: 'El documento no tiene un formato válido.' });
  };
};

const deleteCartProduct = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartModel.findById(cid);
    const product = cart.products.find(p => p.product === pid);
    if (product <= 0) 
      return res.status(400).json({ status: "error", message: 'Producto no encontrado'});
    else 
      cart.products.splice(product, 1);
      await cart.save();
      return res.status(200).json({ status: 'success', cart });
    } catch (error) {
      res.status (400).json({ status:'error', message:'El documento no tiene un formato válido.' });
  };
};

const updateCartProducts = async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartModel.findById(cid);
    cart.products = req.body;
    await cart.save();
    res.status(200).json({ status: "success", cart });
  } catch (error) {
    res.status (400).json({ status: 'error', message:'El documento no tiene un formato válido.' });
  };
};

const updateProductQuantity = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartModel.findById(cid);
    const product = cart.products.find(p => p.product == pid);
    product.quantity = req.body.quantity;
    await cart.save();
    res.status(200).json({ status: "success", message: 'Producto actualizado', cart });
  } catch (error) {
    res.status(400).json({ status: "error", message: 'El documento no tiene un formato válido.' });
  };
};

const deleteCartProducts = async (req, res) => {
  try {
    const cid = req.params.cid;
    const cart = await cartModel.findById(cid);
    cart.products = [];
    await cart.save();
    res.status(200).json({ status: "success", message: 'Productos eliminados', cart });
  } catch (error) {
    return res.status(400).json({ status: "error", message: 'El documento no tiene un formato válido.' });
  };
};

export { getCartById, createCart, addProductInCart, deleteCartProduct, updateCartProducts, updateProductQuantity, deleteCartProducts };

