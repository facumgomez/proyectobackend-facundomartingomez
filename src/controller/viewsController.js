import { cartService, messageService, productService, userService } from '../services/repository.js';

export const getHome = async (req, res) => {
  return res.redirect('/login')
};

export const getChat = async (req, res) => {
  const user = req.user._doc;
  return res.render('chat', { user, title: 'E-commerce | Chat' });
};

export const registerView = (req, res) => {
  return res.render('sessions/register', { title: 'E-commerce | Registrate' });
};

export const loginView = (req, res) => {
  return res.render('sessions/login', { title: 'E-commerce | Log-in' });
};

export const failLoginView = (req, res) => {
  return res.render('error', { error: 'Error. Usuario o contraseña incorrecta.', title: 'E-commerce | Error al iniciar sesión', route: 'login', page: 'log-in' });
};

export const failRegisterView = (req, res) => {
  return res.render('error', { error: 'Error. Ya existe un usuario con ese email.', title: 'E-commerce | Error al registrarse', route: 'register', page: 'registro' });
};

export const profileView = (req, res) => {
  const user = req.user._doc;
  return res.render('sessions/profile', { user, title: 'E-commerce | Mi Perfil' });
};

export const productsView = async (req, res) => {
  try {
    req.query.controller = 'view';
    const user = req.user._doc;
    const products = await productService.getAll(req.query);
    products.docs.forEach(element => { element.cid = user.cart.toString() });
    return res.render('products', { products, user, title: 'E-commerce | Productos' });
  } catch (error) {
    return res.render('error', { error: error.message, title: 'E-commerce | Error', route: 'login', page: 'log-in' });
  };
};

export const getCartView = async (req, res) => {
  try {
    const { cid } = req.params;
    let cart = await cartService.getById(cid);
    let products = [];
    for (let index = 0; index < cart.products.length; index++) {
      let pid = cart.products[index].product;
      const product = await productService.getById(pid);
      const productFound = cart.products.find(element => element.product == product._id.toString());
      
      if (productFound) product.quantity = productFound.quantity;
      product.cid = cid;
      products.push(product);
    };
    return res.render('cart', { products, cid, title: 'E-commerce | Mi Carrito' });
  } catch (error) {
    return res.render('error', { error: error.message, title: 'E-commerce | Error', route: 'products', page: 'productos' });
  };
};

export const getPanelView = async (req, res) =>{
  try {
    const users = await userService.getAll();
    return res.render('panel', { users, title: 'E-commerce | Admin' });
  } catch (error) {
    return res.render('error', { error: error.message, title: 'E-commerce | Error', route: 'products', page: 'productos' });
  };
};