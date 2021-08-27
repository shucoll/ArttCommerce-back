/* eslint-disable radix */
import Sequelize from 'sequelize';
import db from '../config/databaseConfig.js';

const OrderItem = db.define(
  'orderItems',
  {
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

export default OrderItem;
