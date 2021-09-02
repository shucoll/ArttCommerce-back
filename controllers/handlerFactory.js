import Sequelize from 'sequelize';
// import db from '../config/databaseConfig.js';

import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

import User from '../models/userModel.js';
import Order from '../models/orderModel.js';
import Product from '../models/productModel.js';

const { Op } = Sequelize;

export const createOne = (Model) =>
  catchAsync(async (req, res, next) => {
    if (req.user) req.body.userId = req.user.dataValues.id;
    const doc = await Model.create(req.body);

    doc.password = undefined;

    res.status(201).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

export const updateOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const [, [doc]] = await Model.update(req.body, {
      where: {
        id: req.params.id,
      },
      returning: true,
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

export const getOne = (Model) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findOne({
      where: {
        id: req.params.id,
      },
    });

    if (!doc) {
      return next(new AppError('No document found with that ID', 404));
    }
    res.status(200).json({
      status: 'success',
      data: {
        data: doc,
      },
    });
  });

export const getAll = (Model) =>
  catchAsync(async (req, res, next) => {
    const queryObj = { ...req.query };

    //filter
    const filterObj = { ...queryObj };
    const excludedFields = ['page', 'sort', 'limit', 'fields', 'ids', 'q'];
    excludedFields.forEach((el) => delete filterObj[el]);

    //sort
    let sortOrder;
    if (queryObj.sort) {
      if (queryObj.sort.startsWith('-')) {
        sortOrder = 'DESC';
        queryObj.sort = queryObj.sort.substring(1);
      } else sortOrder = 'ASC';
    } else {
      queryObj.sort = 'id';
      sortOrder = 'DESC';
    }

    //limitFields
    let attributes = { exclude: [] };
    if (queryObj.fields) {
      attributes = queryObj.fields.split(',');
    }

    //paginate
    const page = queryObj.page * 1 || 1;
    const limit = queryObj.limit * 1 || 100;
    const skip = (page - 1) * limit;

    let includeObj;
    if (Model === Order)
      includeObj = {
        include: [User, Product],
      };

    let whereObj;

    // getMany
    if (queryObj.ids) {
      const orArray = [];
      JSON.parse(queryObj.ids).forEach((item) => {
        orArray.push({ id: item });
      });

      whereObj = {
        where: { [Op.or]: [...orArray] },
      };
    }
    //Search
    else if (queryObj.q)
      whereObj = {
        where: { name: { [Op.iLike]: `%${queryObj.q}%` }, ...filterObj },
      };
    //filter logged in user
    // else if (option === 'self')
    //   whereObj = {
    //     where: { ...filterObj, userId: req.user.dataValues.id },
    //   };
    //simple filtering
    else
      whereObj = {
        where: { ...filterObj },
      };

    //total doc with filters
    const totalDocLength = await Model.count({
      ...whereObj,
    });

    const doc = await Model.findAll({
      attributes: attributes,
      ...whereObj,
      order: [[`${queryObj.sort}`, `${sortOrder}`]],
      offset: skip,
      limit: limit,
      ...includeObj,
    });

    res.status(200).json({
      status: 'success',
      totalResults: totalDocLength,
      results: doc.length,
      data: {
        data: doc,
      },
    });
  });
