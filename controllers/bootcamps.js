const path = require('path');
const Bootcamp = require('../models/Bootcamp');
const ErrorResponse = require('../utils/ErrorResponse');
const asyncHandler = require('../middleware/asyncHandler');
const geocoder = require('../utils/geocoder');

/**
 * @desc  Get all bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
exports.getBootcamps = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
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
  // Add user to req.body
  req.body.user = req.user.id;

  // Check for previous published bootcamp
  const publishedBootcamp = await Bootcamp.findOne({ user: req.user.id });

  // If user is not an admin, they can only add a single bootcamp at a time
  if (publishedBootcamp && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(`User with id ${req.user.id} already has already published a bootcamp`, 400)
    );
  }

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
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (bootcamp) {
    bootcamp.remove();
    res.status(200).json({ success: true, data: {} });
  } else {
    next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
  }
});

/**
 * @desc  Get a bootcamps within radius
 * @route GET /api/v1/bootcamps/radius/:zipcode/:distance
 * @access Public
 */
exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;

  // Get latitude & longitude from geocoder
  const loc = await geocoder.geocode(zipcode);
  const { latitude, longitude } = loc[0];

  // Calc radius using radians
  // Divide distance by radius of Earth (3,963 mi / 6,378 km)
  const EARTH_RADIUS = 3963;
  const radius = distance / EARTH_RADIUS;

  const bootcamps = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[longitude, latitude], radius] } }
  });

  res.status(200).json({ success: true, count: bootcamps.length, data: bootcamps });
});

/**
 * @desc  Upload photo for bootcamp
 * @route PUT /api/v1/bootcamps/:id/photo
 * @access Private
 */
exports.uploadBootcampPhoto = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findById(req.params.id);

  if (bootcamp) {
    if (!req.files) {
      return next(new ErrorResponse(`Please upload an image file`, 400));
    }

    const file = req.files.file;
    // Make sure file is an image
    if (!file.mimetype.startsWith('image')) {
      return next(new ErrorResponse(`Please upload a valid image file`, 400));
    }

    // Check image file size
    if (file.size > process.env.MAX_FILE_UPLOAD) {
      return next(
        new ErrorResponse(
          `Please upload an image that is ${process.env.MAX_FILE_UPLOAD / 1000000} MB or less`,
          400
        )
      );
    }

    // Create custom filename
    file.name = `photo_${bootcamp._id}${path.parse(file.name).ext}`;

    file.mv(`${process.env.FILE_UPLOAD_PATH}/${file.name}`, async err => {
      if (err) {
        console.log(err);
        return next(new ErrorResponse(`There was a problem while uploading the file`, 500));
      }

      await Bootcamp.findByIdAndUpdate(bootcamp._id, { photo: file.name });

      res.status(200).json({ success: true, data: file.name });
    });
  } else {
    next(new ErrorResponse(`Bootcamp not found with id of ${req.params.id}`, 404));
  }
});
