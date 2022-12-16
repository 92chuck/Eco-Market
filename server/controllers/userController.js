const User = require('../models/User');
const bcrypt = require('bcrypt');
const SALT = parseInt(process.env.SALT);
const { createTokens } = require('../middleware/JWT');

/**
 * Register
 */

exports.register = async (req, res) => {
  try {
    const registerFailed = req.flash('registerFailed');
    const registerSucceeded = req.flash('registerSucceeded');
    res.render('register', {
      title: 'Eco Market - Register',
      registerSucceeded,
      registerFailed,
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

exports.registerPost = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hasedPassword = await bcrypt.hash(password, SALT);
    const newUser = await User.create({
      username,
      email,
      password: hasedPassword,
    });

    const accessToken = createTokens(newUser);

    req.flash('registerSucceeded', 'User has been registered');
    res
      .status(201)
      .cookie('token', accessToken, {
        httpOnly: true,
        secure: true,
        maxAge: 60 * 60 * 24 * 30,
      })
      .redirect('/register');
  } catch (e) {
    console.error(e);
    req.flash(
      'registerFailed',
      'Registration failed: Username or email already exist!'
    );
    res.status(409).redirect('/register');
  }
};

/**
 * Login
 */

exports.login = async (req, res) => {
  try {
    const loginFailed = req.flash('loginFailed');
    const loginSucceeded = req.flash('loginSucceeded');
    res.render('login', {
      title: 'Eco Market - Login',
      loginFailed,
      loginSucceeded,
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

exports.loginPost = async (req, res) => {
  try {
    const { email, username, password } = req.body;
    let user;
    if (email.length === 0) user = await User.findOne({ username });
    if (username.length === 0) user = await User.findOne({ email });
    if (!user) {
      req.flash('loginFailed', 'Login failed: Invalid email or username');
      res.status(401).redirect('/login');
    }
    const hasedPassword = user.password;
    const match = await bcrypt.compare(password, hasedPassword);
    if (!match) {
      req.flash('loginFailed', 'Login failed: Invalid password');
      res.status(401).redirect('/login');
    } else {
      const accessToken = createTokens(user);

      if (!user.isAdmin) {
        req.flash('loginSucceeded', 'User has been verified');
        res
          .status(200)
          .cookie('token', accessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24 * 30,
          })
          .redirect('/login');
      } else {
        res
          .status(200)
          .cookie('token', accessToken, {
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24 * 30,
          })
          .redirect('/admin');
      }
    }
  } catch (e) {
    console.error(e);
    req.flash('loginFailed', 'Login failed: Error Occured');
    res.status(500).redirect('/login');
  }
};

/**
 * Log out
 */

exports.logout = async (req, res) => {
  try {
    res.clearCookie('token').redirect('/');
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
 * admin
 */

exports.admin = async (req, res) => {
  try {
    const users = await User.find().populate('favorites');
    res.render('admin', {
      title: 'Eco Market - Admin',
      isLogged: req.authenticated,
      users,
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
