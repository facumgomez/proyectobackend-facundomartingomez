import { Router } from 'express';
import { failLoginView, failRegisterView, getCartView, getChat, getHome, getPanelView, loginView, productsView, profileView, registerView } from '../controller/viewsController.js';
import { passportCall } from '../middlewares/passportCall.js';

const router = Router();

router.get('/realtimeproducts', (req, res) => { return res.render('realTimeProducts', { style: 'style.css' }) });
router.get('/', getHome);
router.get('/login', loginView);
router.get('/register', registerView);
router.get('/failLogin', failLoginView);
router.get('/failRegister', failRegisterView);
router.get('/products', passportCall('jwt'), productsView);
router.get('/carts/:cid', passportCall('jwt'), getCartView);
router.get('/chat', passportCall('jwt', 'premiumOrUser'), getChat);
router.get('/profile', passportCall('jwt'), profileView);
router.get('/panel', passportCall('jwt', 'admin'), getPanelView);

export default router;