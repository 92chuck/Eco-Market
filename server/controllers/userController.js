const User = require('../models/User');
const bcrypt = require('bcrypt');
const SALT = parseInt(process.env.SALT);

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
    });
  } catch (e) {
    res.status(500).send({ message: e.message || 'Error Occured' });
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

    req.flash('registerSucceeded', 'User has been registered');
    res.status(201).redirect('/register');
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
    });
  } catch (e) {
    res.status(500).send({ message: e.message || 'Error Occured' });
  }
};

exports.loginPost = async (req, res) => {
  try {
    const { emailorUsername, password } = req.body;
    const user = await User.findOne({ username: emailorUsername });
    if (!user) {
      const user = await User.findOne({ email: emailorUsername });
      if (!user) {
        req.flash('loginFailed', 'Login failed: Invalid email or username');
        res.status(401).redirect('/login');
      }
    } else {
      const hasedPassword = user.password;
      const match = await bcrypt.compare(password, hasedPassword);
      if (!match) {
        req.flash('loginFailed', 'Login failed: Invalid password');
        res.status(401).redirect('/login');
      } else {
        req.flash('loginSucceeded', 'User has been verified');
        res.status(200).redirect('/login');
      }
    }
  } catch (e) {
    console.error(e);
    req.flash('loginFailed', 'Login failed: Error Occured');
    res.status(500).redirect('/login');
  }
};
