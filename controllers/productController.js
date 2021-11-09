import Product from '../models/productModel.js';
import Category from '../models/categoryModel.js';
import * as factory from './handlerFactory.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const createProduct = factory.createOne(Product);
export const getProduct = factory.getOne(Product);

export const getAllProducts = factory.getAll(Product);

// export const getAllCategories = factory.getAll(Category);

export const updateProduct = factory.updateOne(Product);
// export const deleteProduct = factory.deleteOne(Product);

export const getHomepageData = catchAsync(async (req, res, next) => {
  const featured = await Product.findAll({
    limit: 5,
    where: { isFeatured: true },
  });
  // const trending = await Product.findAll({
  //   limit: 5,
  //   where: { isTrending: true },
  // });
  const categories = await Category.findAll();
  const newArrivals = await Product.findAll({
    limit: 5,
    order: [['createdAt', 'DESC']],
  });

  res.status(200).json({
    status: 'success',
    data: [featured, categories, newArrivals],
  });
});

export const addProductStock = catchAsync(async (req, res, next) => {
  if (!req.body.incrementValue) {
    return next(new AppError('No increment value provided', 400));
  }
  if (req.body.incrementValue < 1) {
    return next(new AppError('Provide proper increment value', 400));
  }
  const [[[doc]]] = await Product.increment('stock', {
    by: req.body.incrementValue,
    where: {
      id: req.params.id,
    },
  });

  if (!doc) {
    return next(new AppError('No document found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      data: doc,
    },
  });
});
