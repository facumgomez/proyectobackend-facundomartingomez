import cartModel from "../dao/models/cartModel.js"

export const getCartById = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartModel.findById(cid);
    if(cart)
      return res.json({cart});
    return res.status(400).json({message: `Carrito no encontrado con id ${pid}`})
  } catch (error){
    console.log('getCartById', error);
    return res.status(400).json({message:'El documento no tiene un formato válido.'});
  };
};

export const createCart = async (req, res) => {
  try {
    const cart = await cartModel.create({});
    return res.json({message: 'Carrito creado', cart})
  } catch (error){
    console.log('addCart', error);
    return res.status(400).json({message:'El documento no tiene un formato válido.'});
  };
};

export const addProductInCart = async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const cart = await cartModel.findById(cid);
      if(!cart)
      return res.status(400).json({message: `Carriito no encontrado con id ${cid}`});
    const productInCart = cart.products.find(product => product.id.toString() === pid);
    if (productInCart)
      productInCart.quantity++;
    else 
      cart.products.push({id:pid, quantity: 1});
    cart.save();
    return res.json({message: 'Carrito actualizado', cart});
  } catch (error){
    console.log('addProductInCart', error);
    return res.status(400).json({message:'El documento no tiene un formato válido.'});
  };
};