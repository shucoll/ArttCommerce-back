/* eslint-disable radix */
import seqPkg from 'sequelize';
import slugify from 'slugify';
import sequelize from '../config/databaseConfig.js';

const { Sequelize, Model } = seqPkg;

class Product extends Model {}

Product.init(
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    slug: {
      type: Sequelize.STRING,
      unique: true,
    },
    image: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    artist: {
      type: Sequelize.STRING,
    },
    imageType: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.TEXT,
    },
    isFeatured: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    isTrending: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
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
    sequelize,
    modelName: 'products',
    timestamps: true,
  }
);

Product.beforeCreate(async (product) => {
  product.slug = slugify(product.name, { lower: true });
});

export default Product;
