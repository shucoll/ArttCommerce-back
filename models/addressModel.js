/* eslint-disable radix */
import seqPkg from 'sequelize';
import sequelize from '../config/databaseConfig.js';

const { Sequelize, Model } = seqPkg;

class Address extends Model {}

Address.init(
  {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    phone: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    address: {
      type: Sequelize.TEXT,
      allowNull: false,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    country: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    postalCode: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'addresses',
    timestamps: true,
  }
);

export default Address;
