import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';
import filterObj from '../utils/filterObj.js';
import User from '../models/userModel.js';
import * as factory from './handlerFactory.js';

export const getMe = (req, res, next) => {
  req.params.id = req.user.dataValues.id;
  next();
};

export const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, 'name');

  const [, [updatedUser]] = await User.update(filteredBody, {
    where: {
      id: req.user.dataValues.id,
    },
    returning: true,
  });

  if (!updatedUser) {
    return next(new AppError('No document found with that ID', 404));
  }

  updatedUser.password = undefined;
  updatedUser.passwordConfirm = undefined;
  updatedUser.role = undefined;

  res.status(200).json({
    status: 'success',
    data: updatedUser,
  });
});

export const getUser = factory.getOne(User);

export const getAllUsers = factory.getAll(User);
