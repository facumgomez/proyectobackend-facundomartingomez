import { Router } from 'express';
import passport from 'passport';
import { changePassword, changePasswordViews, closeSession, createLogin, createLoginGitHub, createSession, failLoginViews, failRegisterViews, getCurrentSession, getRegisterViews, loginViews, passwordChangedViews, setNewPassword, setNewPasswordViews } from '../controller/sessionController.js';
import { isAdmin } from '../middlewares/auth.js';

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
router.get('/api/sessions/current', isAdmin, getCurrentSession);
router.get('/changePassword', changePasswordViews);
router.post('/api/sessions/changePassword', changePassword);
router.get('/setPassword', setNewPasswordViews);
router.post('/api/sessions/setPassword', setNewPassword);
router.get('/passwordChanged', passwordChangedViews);

export default router;