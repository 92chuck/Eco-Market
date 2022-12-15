const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const path = require('path');
const app = express();
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const { validateToken } = require('./server/middleware/JWT');

require('dotenv').config({ path: path.join(__dirname, '/.env') });

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, './server/public')));
app.use(expressLayouts);
app.use(
  session({
    secret: 'UserRegistrationSession',
    saveUninitialized: true,
    resave: true,
  })
);
app.use(flash());
app.use(cookieParser());

app.set('layout', './layouts/main');
app.set('view engine', 'ejs');

const routes = require('./server/routes/appRoutes');
app.use('/', routes);

app.all('*', validateToken, (req, res) => {
  res.status(400).render('error', {
    title: 'Eco Market - Error page',
    error: `The URI ${req.url} is not valid.`,
    isLogged: req.authenticated,
  });
});

module.exports = app;
