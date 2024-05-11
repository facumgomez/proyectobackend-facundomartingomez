import { Router } from 'express';
import cartModel from '../dao/models/cartModel.js';

const router = Router();

router.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  if (cid.match(/^[0-9a-fA-F]{24}$/)) {
    const cart = await cartModel.findOne({_id: cid}).lean().exec();
    if (!cart) {
      res.status(400).json({ status: "error", message: 'Carrito no encontrado'});
    } else {
      res.render('cart', {title: 'Carrito', cart})};
  } else {
    res.status(400).json({ status: "error", message: `Carrrito no encontrado con id ${cid}`});
  };
});

export default router;