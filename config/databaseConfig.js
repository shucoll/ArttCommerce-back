import Sequelize from 'sequelize';
import dotenv from 'dotenv';

dotenv.config();

export default new Sequelize(
  `${process.env.DATABASE}`,
  'postgres',
  `${process.env.DATABASE_PASSWORD}`,
  {
    host: 'localhost',
    dialect: 'postgres',
    logging: false,
    // timezone: '+00:00',
    // operatorsAliases: false,

    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  }
);
