/* eslint-disable no-await-in-loop */

import stripeFun from 'stripe';
import db from '../config/databaseConfig.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import Address from '../models/addressModel.js';
// import User from '../models/userModel.js';
import * as factory from './handlerFactory.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

const stripe = stripeFun(process.env.STRIPE_SECRET_TEST_KEY);

export const setCurrentUser = (req, res, next) => {
  req.query.userId = req.user.dataValues.id;

  next();
};

export const getOrder = factory.getOne(Order);
export const getAllOrders = factory.getAll(Order);

export const createOrder = catchAsync(async (req, res, next) => {
  // req.body.userId = req.user.dataValues.id;
  const t = await db.transaction();

  const {
    firstName,
    lastName,
    address,
    email,
    phone,
    city,
    country,
    postalCode,
  } = req.body.shippingAddress;

  const addressDoc = await Address.create(
    { firstName, lastName, address, email, city, phone, country, postalCode },
    {
      transaction: t,
    }
  );

  const orderDoc = await Order.create(
    {
      userId: req.user.dataValues.id,
      addressId: addressDoc.dataValues.id,
      paymentId: 'null',
      totalPrice: 0,
    },
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

    // await Order.update(
    //   { totalPrice: total },
    //   {
    //     where: {
    //       id: orderDoc.id,
    //     },
    //     returning: true,
    //     transaction: t,
    //   }
    // );

    const payment = await stripe.paymentIntents.create({
      amount: total * 100,
      currency: 'USD',
      description: 'Your Company Description',
      payment_method: req.body.transaction_id,
      confirm: true,
    });

    // console.log('payment', payment);

    const [, [updatedOrderDoc]] = await Order.update(
      {
        totalPrice: total,
        paymentId: payment.id,
      },
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
