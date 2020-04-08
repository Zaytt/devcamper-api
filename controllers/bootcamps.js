const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @desc  Get all bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.find();
  res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
});

/**
 * @desc  Get a single bootcamp
 * @route GET /api/v1/bootcamps/:id
 * @access Public
 */
exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);
  if (bootcamp) {
    res.status(200).json({ success: true, data: bootcamp });
  } else {
    next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
  }
});

/**
 * @desc  Create a single bootcamp
 * @route POST /api/v1/bootcamps
 * @access Private
 */
exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);
  res.status(201).json({
    success: true,
    data: bootcamp
  });
});

/**
 * @desc  UPdate a single bootcamp
 * @route PUT /api/v1/bootcamps/:id
 * @access Private
 */
exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  if (bootcamp) {
    res.status(200).json({ success: true, data: bootcamp });
  } else {
    next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
  }
});

/**
 * @desc  Delete a bootcamp
 * @route DELETE /api/v1/bootcamps/:id
 * @access Private
 */
exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (bootcamp) {
    res.status(200).json({ success: true, data: {} });
  } else {
    next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
  }
});
