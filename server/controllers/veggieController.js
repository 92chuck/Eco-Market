const Type = require('../models/Type');
const Brand = require('../models/Brand');
const Product = require('../models/Product');

/**
 * Get Hompage
 */

exports.homepage = async (req, res) => {
  try {
    const types = await Type.find();
    const brands = await Brand.find();
    const products = await Product.find().limit(5);

    res.status(200).render('index', {
      title: 'Eco Market - Home',
      types,
      brands,
      products,
    });
  } catch (e) {
    res.status(500).send({ message: e.message || 'Error Occured' });
  }
};

/**
 * Get All Products
 */

exports.products = async (req, res) => {
  try {
    const products = await Product.find().populate('type').populate('brand');
    res
      .status(200)
      .render('allProducts', { title: `Eco Market - Vegetables`, products });
  } catch (e) {
    res.status(500).send({ message: e.message || 'Error Occured' });
  }
};

/**
 * Get Product by Id
 */

exports.productById = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findById(id)
      .populate('type')
      .populate('brand');
    res
      .status(200)
      .render('product', { title: `Eco Market - ${product.name}`, product });
  } catch (e) {
    res.status(422).send({ message: e.message || 'Error Occured' });
  }
};

/**
 * Get Product Categories
 */

exports.productCategories = async (req, res) => {
  try {
    const types = await Type.find();
    res.status(200).render('byCategories', {
      title: `Eco Market - Categories`,
      types,
    });
  } catch (e) {
    res.status(500).send({ message: e.message || 'Error Occured' });
  }
};

/**
 * Get Product by Category
 */

exports.productByCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await Product.find({ type: id })
      .populate('type')
      .populate('brand');
    res.status(200).render('byCategories', {
      title: `Eco Market - ${products[0].type.name}`,
      products,
    });
  } catch (e) {
    res.status(422).send({ message: e.message || 'Error Occured' });
  }
};

/**
 * Get Product Brands
 */

exports.productBrands = async (req, res) => {
  try {
    const brands = await Brand.find();
    res.status(200).render('byBrands', {
      title: `Eco Market - Brands`,
      brands,
    });
  } catch (e) {
    res.status(500).send({ message: e.message || 'Error Occured' });
  }
};

/**
 * Get Product by Brand
 */

exports.productByBrand = async (req, res) => {
  try {
    const { id } = req.params;
    const products = await Product.find({ brand: id })
      .populate('type')
      .populate('brand');
    res.status(200).render('byBrands', {
      title: `Eco Market - ${products[0].brand.name}`,
      products,
    });
  } catch (e) {
    res.status(422).send({ message: e.message || 'Error Occured' });
  }
};

/**
 * Post Search Products
 */

exports.searchProducts = async (req, res) => {
  try {
    let { searchTerm } = req.body;
    let products = await Product.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    })
      .populate('type')
      .populate('brand');
    res
      .status(200)
      .render('search', { title: `Eco Market - Search}`, products });
  } catch (e) {
    res.status(422).send({ message: e.message || 'Error Occured' });
  }
};
