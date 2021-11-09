/* eslint-disable radix */
import seqPkg from 'sequelize';
import sequelize from '../config/databaseConfig.js';

const { Sequelize, Model } = seqPkg;

class Category extends Model {}

Category.init(
  {
    name: {
      type: Sequelize.STRING,
      primaryKey: true,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'categories',
    timestamps: true,
  }
);

export default Category;
