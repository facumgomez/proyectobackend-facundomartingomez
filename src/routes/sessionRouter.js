import { Router } from 'express';
import passport from 'passport';
import { closeSession, createLogin, createLoginGitHub, createSession, failLoginViews, failRegisterViews, getCurrentSession, getRegisterViews, loginViews } from '../controller/sessionController.js';

const router = Router();

router.get('/register', getRegisterViews);
router.post('/api/sessions/register', passport.authenticate('register', {failureRedirect: '/failRegister'}), createSession);
router.get('/failRegister', failRegisterViews);
router.get('/login', loginViews);
router.post('/api/sessions/login', passport.authenticate('login', {failureRedirect: '/session/failLogin'}), createLogin);
router.get('/failLogin', failLoginViews);
router.get('/api/sessions/logout', closeSession);
router.get('/api/sessions/github', passport.authenticate('github', {scope: ['user: email']}), (req, res) => {});
router.get('/api/sessions/callbackGithub', passport.authenticate('github', {failureRedirect: '/login'}), createLoginGitHub);
router.get('api/sessions/current', getCurrentSession);

export default router;