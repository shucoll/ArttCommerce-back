import Sequelize from 'sequelize';
import bcrypt from 'bcryptjs';

import db from '../config/databaseConfig.js';

const User = db.define(
  'users',
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    role: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isIn: [['user', 'admin']],
      },
    },
  },
  {
    timestamps: true,
  }
);

// eslint-disable-next-line no-unused-vars
User.beforeCreate(async (user, options) => {
  user.password = await bcrypt.hash(user.password, 12);
});

export default User;
