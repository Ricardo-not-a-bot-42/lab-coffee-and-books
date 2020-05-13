'use strict';

const { join } = require('path');
const express = require('express');
const createError = require('http-errors');
const logger = require('morgan');
const dotenv = require('dotenv');
const hbs = require('hbs');
const hbsJson = require('hbs-json');
const sassMiddleware = require('node-sass-middleware');
const serveFavicon = require('serve-favicon');
const indexRouter = require('./routes/index');
const placeRouter = require('./routes/places');

const app = express();

app.set('views', join(__dirname, 'views'));
app.set('view engine', 'hbs');

hbs.registerPartials(join(__dirname, 'views/partials'));
hbs.registerHelper('json', hbsJson);

app.use(serveFavicon(join(__dirname, 'public/images', 'favicon.ico')));
app.use(
  sassMiddleware({
    src: join(__dirname, 'public'),
    dest: join(__dirname, 'public'),
    outputStyle:
      process.env.NODE_ENV === 'development' ? 'nested' : 'compressed',
    force: process.env.NODE_ENV === 'development',
    sourceMap: true,
  })
);
app.use(express.static(join(__dirname, 'public')));
app.use(logger('dev'));
app.use(express.urlencoded({ extended: true }));

app.use('/', indexRouter);
app.use('/place', placeRouter);

// Catch missing routes and forward to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Catch all error handler
app.use((error, req, res, next) => {
  // Set error information, with stack only available in development
  res.locals.message = error.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};
  res.status(error.status || 500);
  res.render('error');
});

module.exports = app;
