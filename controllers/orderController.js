/* eslint-disable no-await-in-loop */
import db from '../config/databaseConfig.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
// import User from '../models/userModel.js';
import * as factory from './handlerFactory.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

export const setCurrentUser = (req, res, next) => {
  req.query.userId = req.user.dataValues.id;

  next();
};

export const getOrder = factory.getOne(Order);
export const getAllOrders = factory.getAll(Order);

export const createOrder = catchAsync(async (req, res, next) => {
  // req.body.userId = req.user.dataValues.id;
  const t = await db.transaction();

  const orderDoc = await Order.create(
    { userId: req.user.dataValues.id, totalPrice: 0 },
    {
      transaction: t,
    }
  );

  try {
    let total = 0;

    // eslint-disable-next-line no-restricted-syntax
    for (const product of req.body.orderItems) {
      if (product.quantity <= 0) {
        throw new AppError(`Quantity cannot be less than 1`);
      }
      const productData = await Product.findOne({
        where: {
          id: product.id,
        },
        transaction: t,
      });

      if (!productData) {
        throw new AppError(`Product - ${product.name} does not exist`);
      }

      if (product.quantity > productData.stock) {
        throw new AppError(
          `Quantity is more than stock amount for product - ${productData.name}`
        );
      } else {
        await orderDoc.addProduct(product.id, {
          through: {
            quantity: product.quantity,
            price: productData.price,
            name: productData.name,
            image: productData.image,
          },
          transaction: t,
        });

        await Product.decrement('stock', {
          by: product.quantity,
          where: {
            id: product.id,
          },
          transaction: t,
        });

        total += productData.price * product.quantity;
      }
    }

    if (req.body.totalPrice && total !== req.body.totalPrice) {
      throw new AppError(`An error occurred in placing the order`);
    }

    const [, [updatedOrderDoc]] = await Order.update(
      { totalPrice: total },
      {
        where: {
          id: orderDoc.id,
        },
        returning: true,
        transaction: t,
      }
    );

    await t.commit();

    res.status(201).json({
      status: 'success',
      data: updatedOrderDoc,
    });
  } catch (err) {
    await t.rollback();
    throw err;
  }
});
