const Bootcamp = require('../models/Bootcamp');

/**
 * @desc  Get all bootcamps
 * @route GET /api/v1/bootcamps
 * @access Public
 */
exports.getBootcamps = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'show all bootcamps' });
};

/**
 * @desc  Get a single bootcamp
 * @route GET /api/v1/bootcamps/:id
 * @access Public
 */
exports.getBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `show bootcamp with id ${req.params.id}` });
};

/**
 * @desc  Create a single bootcamp
 * @route POST /api/v1/bootcamps
 * @access Private
 */
exports.createBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: 'create new bootcamp' });
};

/**
 * @desc  UPdate a single bootcamp
 * @route PUT /api/v1/bootcamps/:id
 * @access Private
 */
exports.updateBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `update bootcamp ${req.params.id}` });
};

/**
 * @desc  Delete a bootcamp
 * @route DELETE /api/v1/bootcamps/:id
 * @access Private
 */
exports.deleteBootcamp = (req, res, next) => {
  res.status(200).json({ success: true, msg: `delete bootcamp ${req.params.id}` });
};
