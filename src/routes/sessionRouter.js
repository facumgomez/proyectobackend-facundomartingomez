import { Router } from 'express';
import passport from 'passport';
import { closeSession, createLogin, createLoginGitHub, createRegister, currentSession } from '../controller/sessionController.js';

const router = Router();

router.post('/register', passport.authenticate('register', { failureRedirect: '/failRegister' }), createRegister);
router.post('/login', passport.authenticate('login', { failureRedirect: '/failLogin' }), createLogin);
router.get('/logout', closeSession);
router.get('/github', passport.authenticate('github', { scope: ['user: email']}), (req, res) => {});
router.get('/callbackGithub', passport.authenticate('github', { failureRedirect: '/failLogin' }), createLoginGitHub);
router.get('/current', currentSession);

export default router;