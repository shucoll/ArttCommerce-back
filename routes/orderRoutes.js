import express from 'express';

import * as orderController from '../controllers/orderController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router.use(authController.protect);

router
  .route('/')
  .get(orderController.setCurrentUser, orderController.getAllOrders)
  .post(authController.restrictTo('user'), orderController.createOrder);

router
  .route('/allOrders')
  .get(authController.restrictTo('admin'), orderController.getAllOrders);

router
  .route('/:id')
  .get(authController.restrictToSelf('order'), orderController.getOrder);

export default router;
