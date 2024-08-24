import  { Router } from 'express';  
import { adminChangeRole, changeRole, deleteDocuments, deleteUser, deleteUsers, getUsers, uploadDocuments } from '../controller/usersController.js';
import { passportCall } from '../middlewares/passportCall.js';
import { fields, upload } from '../middlewares/multer.js';

const router = Router();

router.get('/', getUsers);
router.get('/premium/:uid', passportCall('jwt', 'premiumOrUser'), changeRole);
router.get('/admin/changeRole/:uid', passportCall('jwt', 'admin'), adminChangeRole);
router.post('/:uid/documents', passportCall('jwt', 'premiumOrUser'), upload.fields(fields), uploadDocuments);
router.delete('/', deleteUsers);
router.delete('/admin/deleteUser/:uid', passportCall('jwt', 'admin'), deleteUser);
router.delete('/:uid/documents', passportCall('jwt', 'premiumOrUser'), deleteDocuments);

export default router;