import { Router } from 'express';
import { getCartsViews } from '../controller/views/cartsControllerView.js';

const router = Router();

router.get('/:cid', getCartsViews);

export default router;