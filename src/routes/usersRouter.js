import  { Router } from 'express';  
import userModel from '../dao/models/userModel.js';
import { JWT_COOKIE_NAME } from '../config/credentials.js';

const router = Router();

router.get('/premium/:uid', async (req, res) => {
  try {
    console.log(req.user);
    const uid = req.user._id;
    let user = await userModel.findOne({_id: uid});

    if(!user) return res.status(401).render('error', { error: 'No existe ningún usuario con ese email.' });
    if(user.role == 'user') {
      user.role = 'premium';
      await userModel.findOneAndUpdate({ _id: uid }, user);
      return res.clearCookie(JWT_COOKIE_NAME).render('sessions/changeRole');
    };
    if(user.role == 'premium') {
      user.role = 'user';
      await userModel.findOneAndUpdate({ _id: user._id }, user);
      return res.clearCookie(JWT_COOKIE_NAME).render('sessions/changeRole');
    };
    res.status(401).render('error', { error: 'Solo los usuarios con rol USER o PREMIUM pueden cambiar de su rol.' });
  } catch (error) {
    console.log(error);
  };
})

export default router;