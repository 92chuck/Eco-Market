const { sign, verify } = require('jsonwebtoken');

/**
 * Sign in and up token generating middleware
 */

exports.createTokens = (user) => {
  const accessToken = sign(
    { id: user._id, username: user.username, isAdmin: user.isAdmin },
    process.env.JWT_KEY
  );
  return accessToken;
};

/**
 * All routes token checking middleware
 */

exports.validateToken = (req, res, next) => {
  try {
    const accessToken = req.cookies.token;
    if (!accessToken) {
      req.authenticated = false;
      return next();
    }
    const validateToken = verify(accessToken, process.env.JWT_KEY);
    if (validateToken) {
      req.authenticated = true;
      req.isAdmin = validateToken.isAdmin;
      req.userId = validateToken.id;
      if (validateToken.isAdmin) {
        return res.status(403).render('error', {
          title: 'Eco Market - Error page',
          error: '403 Forbidden, Not authorized',
          isLogged: req.authenticated,
        });
      }
      return next();
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
 * Admin page middleware
 */

exports.isAdmin = (req, res, next) => {
  try {
    const accessToken = req.cookies.token;
    if (!accessToken) {
      req.authenticated = false;
      return res.status(403).render('error', {
        title: 'Eco Market - Error page',
        error: '403 Forbidden, Not authorized',
        isLogged: req.autenticated,
      });
    }
    const validateToken = verify(accessToken, process.env.JWT_KEY);
    if (validateToken) {
      req.authenticated = true;
      req.isAdmin = validateToken.isAdmin;
      req.userId = validateToken.id;

      if (!validateToken.isAdmin) {
        return res.status(403).render('error', {
          title: 'Eco Market - Error page',
          error: '403 Forbidden, Not authorized',
          isLogged: req.authenticated,
        });
      }
      return next();
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
