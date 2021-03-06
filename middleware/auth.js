const jwt = require('jsonwebtoken');
const asyncHandler = require('./asyncHandler');
const ErrorResponse = require('../utils/ErrorResponse');
const User = require('../models/User');

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Get token string from authorization header
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.token) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return next(new ErrorResponse('Unauthorized access', 401));
  }

  // Verify token
  try {
    // Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find token user

    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new ErrorResponse('Non existent user', 400));
    }
    req.user = user;

    next();
  } catch (error) {
    return next(new ErrorResponse('Unauthorized access', 401));
  }
});

// Grant access to specific roles
exports.authorize = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new ErrorResponse(`User role '${req.user.role}' is not allowed to access this route`, 403)
      );
    }

    next();
  };
};
