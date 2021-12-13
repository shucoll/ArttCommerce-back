import { dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import dotenv from 'dotenv';

import db from '../config/databaseConfig.js';
import sequelizeSync from '../config/sequelizeSyncConfig.js';
import Product from '../models/productModel.js';
import User from '../models/userModel.js';
import Category from '../models/categoryModel.js';

dotenv.config();

const __dirname = dirname(fileURLToPath(import.meta.url));

db.authenticate()
  .then(() => console.log('Database connected...'))
  .catch((err) => console.log(`Error: ${err}`));

sequelizeSync();

const products = JSON.parse(
  fs.readFileSync(`${__dirname}/products.json`, 'utf-8')
);

const users = JSON.parse(fs.readFileSync(`${__dirname}/users.json`, 'utf-8'));

const categories = JSON.parse(
  fs.readFileSync(`${__dirname}/categories.json`, 'utf-8')
);

const importData = async () => {
  try {
    // await User.bulkCreate(users);
    // await Category.bulkCreate(categories); 
    // await Product.bulkCreate(products);

    console.log('Data successfully loaded!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

const deleteData = async () => {
  try {
    await Category.destroy();
    await Product.destroy();
    await User.destroy();
    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
  }
  process.exit();
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteData();
}

//Delete data
//node ./data/import-data.js --delete

//Import data
//node ./data/import-data.js --import
