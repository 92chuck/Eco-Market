const Type = require('../models/Type');
const Brand = require('../models/Brand');
const Product = require('../models/Product');

/**
 * Get Hompage
 */

exports.homepage = async (req, res) => {
  try {
    const types = await Type.find().limit(5);
    const brands = await Brand.find().limit(5);
    const products = await Product.find().limit(5);

    if (req.authenticated) {
      res.status(200).render('index', {
        title: 'Eco Market - Home',
        layout: '../views/layouts/sidebar',
        types,
        brands,
        products,
        isLogged: req.authenticated,
      });
    } else {
      res.status(200).render('index', {
        title: 'Eco Market - Home',
        types,
        brands,
        products,
        isLogged: req.authenticated,
      });
    }
  } catch (e) {
    console.error(e);
    res.status(500).render('error', {
      title: 'Eco Market - Error page',
      error: e,
      isLogged: req.authenticated,
    });
  }
};

/**
 * Get All Products
 */

exports.products = async (req, res) => {
  try {
    const products = await Product.find().populate('type').populate('brand');
    res.status(200).render('allProducts', {
      title: `Eco Market - Vegetables`,
      products,
      isLogged: req.authenticated,
    });
  } catch (e) {
    console.error(e);
    res.status(500).render('error', {
      title: 'Eco Market - Error page',
      error: e,
      isLogged: req.authenticated,
    });
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
    const products = await Product.find({ brand: product.brand._id })
      .limit(5)
      .populate('type')
      .populate('brand');
    res.status(200).render('product', {
      title: `Eco Market - ${product.name}`,
      product,
      products,
      isLogged: req.authenticated,
    });
  } catch (e) {
    console.error(e);
    res.status(422).render('error', {
      title: 'Eco Market - Error page',
      error: e,
      isLogged: req.authenticated,
    });
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
      isLogged: req.authenticated,
    });
  } catch (e) {
    console.error(e);
    res.status(500).render('error', {
      title: 'Eco Market - Error page',
      error: e,
      isLogged: req.authenticated,
    });
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
      isLogged: req.authenticated,
    });
  } catch (e) {
    console.error(e);
    res.status(422).render('error', {
      title: 'Eco Market - Error page',
      error: e,
      isLogged: req.authenticated,
    });
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
      isLogged: req.authenticated,
    });
  } catch (e) {
    console.error(e);
    res.status(500).render('error', {
      title: 'Eco Market - Error page',
      error: e,
      isLogged: req.authenticated,
    });
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
      isLogged: req.authenticated,
    });
  } catch (e) {
    console.error(e);
    res.status(422).render('error', {
      title: 'Eco Market - Error page',
      error: e,
      isLogged: req.authenticated,
    });
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
    res.status(200).render('search', {
      title: 'Eco Market - Search',
      products,
      isLogged: req.authenticated,
    });
  } catch (e) {
    console.error(e);
    res.status(422).render('error', {
      title: 'Eco Market - Error page',
      error: e,
      isLogged: req.authenticated,
    });
  }
};
