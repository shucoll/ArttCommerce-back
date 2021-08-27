/* eslint-disable radix */
import Sequelize from 'sequelize';
import db from '../config/databaseConfig.js';

const Order = db.define(
  'orders',
  {
    totalPrice: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default Order;
