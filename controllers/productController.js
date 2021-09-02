import Product from '../models/productModel.js';
import * as factory from './handlerFactory.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const createProduct = factory.createOne(Product);
export const getProduct = factory.getOne(Product);

export const getAllProducts = factory.getAll(Product);

export const updateProduct = factory.updateOne(Product);
// export const deleteProduct = factory.deleteOne(Product);

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
