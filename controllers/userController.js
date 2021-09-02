import User from '../models/userModel.js';
import * as factory from './handlerFactory.js';

export const getMe = (req, res, next) => {
  req.params.id = req.user.dataValues.id;
  next();
};

export const getUser = factory.getOne(User);

export const getAllUsers = factory.getAll(User);
