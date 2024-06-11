import { Router } from 'express';
import { getProductsViews } from '../controller/views/productsControllerView.js';
const router = Router();

router.get('/', getProductsViews);

export default router;