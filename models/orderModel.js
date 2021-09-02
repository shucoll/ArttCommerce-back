/* eslint-disable radix */
import seqPkg from 'sequelize';
import sequelize from '../config/databaseConfig.js';

const { Sequelize, Model } = seqPkg;

class Order extends Model {}

Order.init(
  {
    totalPrice: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'orders',
    timestamps: true,
  }
);

export default Order;
