const errorHandler = (err, req, res, next) => {
  // Log to console for development purposes
  console.log(err.stack.red);

  res.status(err.statusCode).json({
    success: false,
    error: err.message || 'Server Error'
  });
};

module.exports = errorHandler;
