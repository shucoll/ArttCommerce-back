import express from 'express';

import * as userController from '../controllers/userController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/login', authController.login);

router.use(authController.protect);

router.get('/me', userController.getMe, userController.getUser);

router.use(authController.restrictTo('admin'));

router.route('/').get(userController.getAllUsers);

router.route('/:id').get(userController.getUser);

export default router;
