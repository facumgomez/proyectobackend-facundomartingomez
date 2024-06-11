import CartService from '../../services/cartsService.js'
const cartService = new CartService();

export const getCartsViews = async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartService.getById(cid);
    if (!cart) 
      return res.status(400).json({ status: 'error', message: 'Carrito no encontrado' });
    res.render('cart', {
      title: 'Carrito',
      cart
    });
  } catch (error) {
    if (error.name === 'ErrorCast') 
      return res.status(400).json({ status: 'error', message: 'No hay ningún carrito con ese ID' });
    res.status(400).json({ status: 'error', message: 'El documento no tiene un formato válido.' });
  };
};

