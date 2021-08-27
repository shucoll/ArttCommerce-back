/* eslint-disable radix */
import Sequelize from 'sequelize';
import db from '../config/databaseConfig.js';

const Product = db.define(
  'products',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    image: {
      type: Sequelize.STRING,
      // allowNull: false,
    },
    // category: {
    //   type: Sequelize.STRING,
    //   // allowNull: false,
    // },
    description: {
      type: Sequelize.STRING,
      // allowNull: false,
    },
    price: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        isPositive(value) {
          if (parseInt(value) <= 0) {
            throw new Error('Price must be greater than 0');
          }
        },
      },
    },
    stock: {
      type: Sequelize.INTEGER,
      allowNull: false,
      validate: {
        isPositive(value) {
          if (parseInt(value) < 0) {
            throw new Error('Stock Value must be greater than 0');
          }
        },
      },
    },
  },
  {
    timestamps: true,
  }
);

export default Product;
