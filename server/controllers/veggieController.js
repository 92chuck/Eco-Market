const Type = require('../models/Type');
const Brand = require('../models/Brand');
const Product = require('../models/Product');
const User = require('../models/User');
/**
 * Pagination helper function
 */

const pagination = (dataLength, limit, currPage) => {
  let totalPages;
  if (dataLength % limit !== 0) totalPages = Math.floor(dataLength / limit) + 1;
  else totalPages = dataLength / limit;
  let skipIdx = currPage - 1;
  let previousPage = currPage - 1;
  let nextPage = currPage + 1;
  return [totalPages, skipIdx, previousPage, nextPage];
};

/**
 * Get Hompage
 */

exports.homepage = async (req, res) => {
  try {
    const types = await Type.find().limit(5);
    const brands = await Brand.find().limit(5);
    const products = await Product.find().limit(5);

    if (req.authenticated) {
      const user = await User.findById(req.userId).populate('favorites');
      res.status(200).render('index', {
        title: 'Eco Market - Home',
        layout: '../views/layouts/sidebar',
        types,
        brands,
        products,
        isLogged: req.authenticated,
        user,
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
    const types = await Type.find();
    const brands = await Brand.find();
    const brandsQueryStr = req.query.brands;
    const typesQueryStr = req.query.types;

    //Check if there's any query from request for filtering

    let queryBrands;
    let queryTypes;

    if (brandsQueryStr) {
      queryBrands = brandsQueryStr.split(';');
    }
    if (typesQueryStr) {
      queryTypes = typesQueryStr.split(';');
    }

    //Check total products' quantity we need to send to the client for pagination

    let totalProductLength;

    if (brandsQueryStr && typesQueryStr) {
      const result = await Product.find({
        brand: [...queryBrands],
        type: [...queryTypes],
      });
      totalProductLength = result.length;
    } else if (brandsQueryStr && !typesQueryStr) {
      const result = await Product.find({
        brand: [...queryBrands],
      });
      totalProductLength = result.length;
    } else if (!brandsQueryStr && typesQueryStr) {
      const result = await Product.find({
        type: [...queryTypes],
      });
      totalProductLength = result.length;
    } else {
      const result = await Product.find();
      totalProductLength = result.length;
    }

    // Build some information for pagination

    const [totalPages, skipIdx, previousPage, nextPage] = pagination(
      totalProductLength,
      9,
      parseInt(req.query.page)
    );

    let products;
    if (req.query.brands && req.query.types) {
      products = await Product.find({
        brand: [...queryBrands],
        type: [...queryTypes],
      })
        .populate('type')
        .populate('brand')
        .limit(9)
        .skip(skipIdx * 9);
    } else if (req.query.brands && !req.query.types) {
      products = await Product.find({
        brand: [...queryBrands],
      })
        .populate('type')
        .populate('brand')
        .limit(9)
        .skip(skipIdx * 9);
    } else if (!req.query.brands && req.query.types) {
      products = await Product.find({
        type: [...queryTypes],
      })
        .populate('type')
        .populate('brand')
        .limit(9)
        .skip(skipIdx * 9);
    } else {
      products = await Product.find()
        .populate('type')
        .populate('brand')
        .limit(9)
        .skip(skipIdx * 9);
    }
    const queryStrBuilder = (brandsQueryStr, typesQueryStr) => {
      let result;
      if (brandsQueryStr && typesQueryStr)
        result = `&brands=${brandsQueryStr}&types=${typesQueryStr}`;
      else if (brandsQueryStr && !typesQueryStr)
        result = `&brands=${brandsQueryStr}`;
      else if (brandsQueryStr && !typesQueryStr)
        result = `&types=${typesQueryStr}`;
      else result = ' ';
      return result;
    };

    const queryStr = queryStrBuilder(brandsQueryStr, typesQueryStr);

    res.status(200).render('allProducts', {
      title: `Eco Market - Vegetables`,
      products,
      types,
      brands,
      isLogged: req.authenticated,
      nextPage,
      previousPage,
      totalPages,
      queryStr,
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

    let user;
    if (req.authenticated) {
      user = await User.findById(req.userId);
    }

    res.status(200).render('product', {
      title: `Eco Market - ${product.name}`,
      product,
      products,
      isLogged: req.authenticated,
      user,
    });
  } catch (e) {
    console.error(e);
    res.status(422).render('error', {
      title: 'Eco Market - Error page',
      error: 'No product found!',
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
    res.status(200).render('Categories', {
      title: `Eco Market - Categories`,
      types,
      isLogged: req.authenticated,
    });
  } catch (e) {
    console.error(e);
    res.status(500).render('error', {
      title: 'Eco Market - Error page',
      error: 'No Categories Found',
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

    const allProducts = await Product.find({ type: id });
    const [totalPages, skipIdx, previousPage, nextPage] = pagination(
      allProducts.length,
      9,
      parseInt(req.query.page)
    );

    const products = await Product.find({ type: id })
      .populate('type')
      .populate('brand')
      .limit(9)
      .skip(skipIdx * 9);
    res.status(200).render('byCategories', {
      title: `Eco Market - ${products[0].type.name}`,
      products,
      isLogged: req.authenticated,
      totalPages,
      previousPage,
      nextPage,
    });
  } catch (e) {
    console.error(e);
    res.status(422).render('error', {
      title: 'Eco Market - Error page',
      error: 'No Product found!',
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
    res.status(200).render('brands', {
      title: `Eco Market - Brands`,
      brands,
      isLogged: req.authenticated,
    });
  } catch (e) {
    console.error(e);
    res.status(500).render('error', {
      title: 'Eco Market - Error page',
      error: 'No Brands found',
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
    const allProducts = await Product.find({ brand: id });

    const [totalPages, skipIdx, previousPage, nextPage] = pagination(
      allProducts.length,
      9,
      parseInt(req.query.page)
    );

    const products = await Product.find({ brand: id })
      .populate('type')
      .populate('brand')
      .limit(9)
      .skip(skipIdx * 9);
    res.status(200).render('byBrands', {
      title: `Eco Market - ${products[0].brand.name}`,
      products,
      isLogged: req.authenticated,
      totalPages,
      previousPage,
      nextPage,
    });
  } catch (e) {
    console.error(e);
    res.status(422).render('error', {
      title: 'Eco Market - Error page',
      error: 'No Products found',
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
      error: 'No Product found',
      isLogged: req.authenticated,
    });
  }
};

/**
 * Put Add Favorites
 */

exports.addFavorite = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    const user = await User.findById(userId);
    const userFavorites = user.favorites;
    userFavorites.push(productId);

    await user.updateOne({ favorites: userFavorites }, { new: true });
    res.sendStatus(200);
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
 * Put Remove Favorites
 */

exports.removeFavorite = async (req, res) => {
  try {
    const userId = req.userId;
    const { productId } = req.body;

    const user = await User.findById(userId);
    const userFavorites = user.favorites;
    const idx = userFavorites.indexOf(productId);
    userFavorites.splice(idx, 1);

    await user.updateOne({ favorites: userFavorites }, { new: true });
    res.sendStatus(200);
  } catch (e) {
    console.error(e);
    res.status(422).render('error', {
      title: 'Eco Market - Error page',
      error: e,
      isLogged: req.authenticated,
    });
  }
};
