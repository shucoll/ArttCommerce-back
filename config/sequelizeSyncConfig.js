/* eslint-disable no-console */
import db from './databaseConfig.js';

import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import OrderItem from '../models/orderItemModel.js';

export default () => {
  Product.belongsTo(User);
  User.hasMany(Product);

  Order.belongsTo(User, { onDelete: 'RESTRICT' });
  User.hasMany(Order);

  Order.belongsToMany(Product, {
    through: OrderItem,
    onDelete: 'CASCADE',
  });
  Product.belongsToMany(Order, {
    through: OrderItem,
    onDelete: 'RESTRICT',
  });

  db.sync()
    .then(() => {
      console.log('DB sync successful');
    })
    .catch((err) => {
      console.log(err);
    });
};
