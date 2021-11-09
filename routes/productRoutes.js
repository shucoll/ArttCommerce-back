import express from 'express';

import * as productController from '../controllers/productController.js';
import * as authController from '../controllers/authController.js';

const router = express.Router();

router
  .route('/')
  .get(productController.getAllProducts)
  .post(
    authController.protect,
    authController.restrictTo('admin'),
    productController.createProduct
  );

// router.route('/categories').get(productController.getAllCategories);
router.route('/homepageData').get(productController.getHomepageData);

router.route('/:id').get(productController.getProduct);

export default router;
