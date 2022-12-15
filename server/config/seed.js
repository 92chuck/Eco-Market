const path = require('path');
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
require('dotenv').config(path.join(__dirname, '../.env'));

const { MONGO_URL } = process.env;
const bcrypt = require('bcrypt');
const SALT = parseInt(process.env.SALT);

const User = require('../models/User');
const Product = require('../models/Product');
const Brand = require('../models/Brand');
const Type = require('../models/Type');

async function run() {
  try {
    await mongoose.connect(MONGO_URL);
    console.log('Connected to DB.');

    //Reset database
    await Promise.all([
      User.collection.drop(),
      Product.collection.drop(),
      Brand.collection.drop(),
      Type.collection.drop(),
    ]);

    //User
    const userpasswordHash = await bcrypt.hash('User1@', SALT);
    const createUser = await User.create({
      username: 'user1',
      email: 'user1@gmail.com',
      password: userpasswordHash,
      isAdmin: false,
    });
    //Admin user
    const adminpasswordHash = await bcrypt.hash('Admin1@', SALT);
    const createAdminUser = await User.create({
      username: 'admin1',
      email: 'admin1@gmail.com',
      password: adminpasswordHash,
      isAdmin: true,
    });

    //brand
    const brandNames = [
      'Whole Foods Market',
      'Urban Organics',
      'Wildwood',
      '365 Everyday',
      "Trader Joe's",
    ];
    const brands = [];
    for (let i = 0; i < brandNames.length; i++) {
      brands.push({
        name: brandNames[i],
      });
    }
    const insertManyBrands = await Brand.insertMany(brands);

    //brand id references
    const wholeFoodMarket = await Brand.findOne({
      name: 'Whole Foods Market',
    });
    const urbanOraganics = await Brand.findOne({ name: 'Urban Organics' });
    const wildWood = await Brand.findOne({ name: 'Wildwood' });
    const threeSixFiveEveryDay = await Brand.findOne({
      name: '365 Everyday',
    });
    const traderJoes = await Brand.findOne({ name: "Trader Joe's" });

    //Type
    const typeNames = ['Roots', 'Leafy Greens', 'Edible Plant Stem'];
    const types = [];
    for (let i = 0; i < typeNames.length; i++) {
      types.push({
        name: typeNames[i],
      });
    }
    const insertManyTypes = await Type.insertMany(types);

    //products - root
    const rootProductsNames = [
      'Yam',
      'Beets',
      'Onion',
      'Potato',
      'Daikon',
      'Radish',
      'Ginger',
      'Turmeric',
      'Carrot',
      'Garlic',
    ];
    const rootCategoryRef = await Type.findOne({ name: 'Roots' });
    const rootProducts = [];
    for (let i = 0; i < rootProductsNames.length; i++) {
      if (i < 2) {
        rootProducts.push({
          name: rootProductsNames[i],
          type: rootCategoryRef._id,
          brand: wholeFoodMarket._id,
        });
      } else if (2 <= i && i < 4) {
        rootProducts.push({
          name: rootProductsNames[i],
          type: rootCategoryRef._id,
          brand: urbanOraganics._id,
        });
      } else if (4 <= i && i < 6) {
        rootProducts.push({
          name: rootProductsNames[i],
          type: rootCategoryRef._id,
          brand: wildWood._id,
        });
      } else if (6 <= i && i < 8) {
        rootProducts.push({
          name: rootProductsNames[i],
          type: rootCategoryRef._id,
          brand: threeSixFiveEveryDay._id,
        });
      } else {
        rootProducts.push({
          name: rootProductsNames[i],
          type: rootCategoryRef._id,
          brand: traderJoes._id,
        });
      }
    }
    const insertManyRootProducts = await Product.insertMany(rootProducts);

    //products - Leafy Greens
    const greenProductNames = [
      'Arugula',
      'Collard greens',
      'Kale',
      'Mustard greens',
      'Bok choy',
      'Spinach',
      'Romaine',
      'Microgreens',
      'Cabbage',
      'Watercress',
    ];
    const greenCategoryRef = await Type.findOne({ name: 'Leafy Greens' });
    const greenProducts = [];
    for (let i = 0; i < greenProductNames.length; i++) {
      if (i < 2) {
        greenProducts.push({
          name: greenProductNames[i],
          type: greenCategoryRef._id,
          brand: wholeFoodMarket._id,
        });
      } else if (2 <= i && i < 4) {
        greenProducts.push({
          name: greenProductNames[i],
          type: greenCategoryRef._id,
          brand: urbanOraganics._id,
        });
      } else if (4 <= i && i < 6) {
        greenProducts.push({
          name: greenProductNames[i],
          type: greenCategoryRef._id,
          brand: wildWood._id,
        });
      } else if (6 <= i && i < 8) {
        greenProducts.push({
          name: greenProductNames[i],
          type: greenCategoryRef._id,
          brand: threeSixFiveEveryDay._id,
        });
      } else {
        greenProducts.push({
          name: greenProductNames[i],
          type: greenCategoryRef._id,
          brand: traderJoes._id,
        });
      }
    }
    const insertManygreenProducts = await Product.insertMany(greenProducts);

    //products - Edible Plant Stem
    const stemProductNames = [
      'Celery',
      'Asparagus',
      'Rhubarb',
      'Kohlrabi',
      'Broccoli',
      'Cauliflower',
      'Bamboo Shoot',
      'Brussels sprout',
      'Garlic leek',
      'Green onion',
    ];
    const stemCategoryRef = await Type.findOne({ name: 'Edible Plant Stem' });
    const stemProducts = [];
    for (let i = 0; i < stemProductNames.length; i++) {
      if (i < 2) {
        stemProducts.push({
          name: stemProductNames[i],
          type: stemCategoryRef._id,
          brand: wholeFoodMarket._id,
        });
      } else if (2 <= i && i < 4) {
        stemProducts.push({
          name: stemProductNames[i],
          type: stemCategoryRef._id,
          brand: urbanOraganics._id,
        });
      } else if (4 <= i && i < 6) {
        stemProducts.push({
          name: stemProductNames[i],
          type: stemCategoryRef._id,
          brand: wildWood._id,
        });
      } else if (6 <= i && i < 8) {
        stemProducts.push({
          name: stemProductNames[i],
          type: stemCategoryRef._id,
          brand: threeSixFiveEveryDay._id,
        });
      } else {
        stemProducts.push({
          name: stemProductNames[i],
          type: stemCategoryRef._id,
          brand: traderJoes._id,
        });
      }
    }
    const insertManystemProducts = await Product.insertMany(stemProducts);
  } catch (err) {
    console.log(err);
  } finally {
    await mongoose.connection.close();
    console.log('Seed completed!');
  }
}

run().catch(console.dir);
