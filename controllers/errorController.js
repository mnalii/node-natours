const AppError = require('../utils/appError');

/* eslint-disable no-param-reassign */
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  const value = err.keyValue.name;
  const message = `Duplicate fields value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};

const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);

  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    });
  } else {
    // RENDERED website
    res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }
};

// Error handling for invalid JWT
const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTEpiredError = () =>
  new AppError('The token has been expired. Please log in again!', 401);

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith('/api')) {
    // Operational, trusted error: send message to the client
    if (err.isOperational) {
      console.log(err);
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message
      });
      // Programming or other unknown error
    }
    // 1) Log error
    // eslint-disable-next-line no-console
    console.error(err);

    // 2) Set generic message
    return res.status(500).json({
      status: 'error',
      message: 'Something went very wrong'
    });
  }
  if (err.isOperational) {
    return res.status(err.statusCode).render('error', {
      title: 'Something went wrong!',
      msg: err.message
    });
  }
  // 1) Log error
  // eslint-disable-next-line no-console
  console.error(err);
  // Programming or other unknown error

  // 2) Set generic message
  return res.status(err.statusCode).render('error', {
    title: 'Something went wrong',
    msg: 'Please try again later'
  });
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === 'production') {
    // let error = { ...err };
    console.log(err);
    let error = Object.create(err);
    if (error.name === 'CastError') error = handleCastErrorDB(error);
    if (error.code === 11000) error = handleDuplicateFieldsDB(error);

    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error);

    if (error.name === 'JsonWebTokenError') error = handleJWTError();
    if (error.name === 'TokenExpiredError') error = handleJWTEpiredError();

    sendErrorProd(error, req, res);
  }
};
