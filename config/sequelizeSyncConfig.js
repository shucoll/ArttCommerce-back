/* eslint-disable no-console */
import db from './databaseConfig.js';

import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import OrderItem from '../models/orderItemModel.js';
// eslint-disable-next-line no-unused-vars
import Category from '../models/categoryModel.js';

export default () => {
  Product.belongsTo(User);
  User.hasMany(Product);

  Order.belongsTo(User, { onDelete: 'RESTRICT' });
  User.hasMany(Order);

  Product.belongsTo(Category);
  Category.hasMany(Product);

  Order.belongsToMany(Product, {
    through: OrderItem,
    onDelete: 'CASCADE',
  });

  Product.belongsToMany(Order, {
    through: OrderItem,
    onDelete: 'NO ACTION',
  });

  db.sync()
    .then(() => {
      console.log('DB sync successful');
    })
    .catch((err) => {
      console.log(err);
    });
};
