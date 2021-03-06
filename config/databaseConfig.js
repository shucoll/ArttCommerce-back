import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export default new Sequelize(
  `${process.env.DATABASE}`,
  `${process.env.DATABASE_USERNAME}`,
  `${process.env.DATABASE_PASSWORD}`,
  {
    host: `${process.env.DATABASE_HOST}`,
    port: `${process.env.DATABASE_PORT}`,
    dialect: 'postgres',
    logging: false,

    //comment out this dialectOption in local
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);
