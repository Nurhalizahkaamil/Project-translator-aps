const AppError = require('../utils/appError');

const sendErrorDev = (error, res) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';
    const message = error.message;
    const stack = error.stack;

    res.status(statusCode).json({
        status,
        message,
        stack,
    });
};

const sendErrorProd = (error, res) => {
    const statusCode = error.statusCode || 500;
    const status = error.status || 'error';
    const message = error.message;
    const stack = error.stack;

    if (error.isOperational) {
        return res.status(statusCode).json({
            status,
            message,
        });
    }

    console.error(error.name, error.message, stack); // Log the error for debugging in production
    return res.status(500).json({
        status: 'error',
        message: 'Something went very wrong',
    });
};

const globalErrorHandler = (err, _req, res, _next) => {
    if (err.name === 'JsonWebTokenError') {
        err = new AppError('Invalid token', 401);
    }
    if (err.name === 'SequelizeValidationError') {
        err = new AppError(err.errors[0].message, 400);
    }
    if (err.name === 'SequelizeUniqueConstraintError') {
        err = new AppError(err.errors[0].message, 400); // Handle SequelizeUniqueConstraintError
    }
    if (process.env.NODE_ENV === 'development') {
        return sendErrorDev(err, res);
    }
    sendErrorProd(err, res);
};

module.exports = globalErrorHandler;
