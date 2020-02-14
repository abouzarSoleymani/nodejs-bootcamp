const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Task = require('../models/Task');

// @desc      Get tasks
// @route     GET /api/v1/tasks
// @access    Public
exports.getTasks = asyncHandler(async (req, res, next) => {
    const tasks = await Task.find({ user: req.user.id });
  return res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// @desc      Get single task
// @route     GET /api/v1/tasks/:id
// @access    Public
exports.getTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id).populate({
    path: 'tasks',
    select: 'name description'
  });

  if (!task) {
    return next(
      new ErrorResponse(`No task found with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc      Add task
// @route     POST /api/v1/tasks
// @access    Private
exports.addTask = asyncHandler(async (req, res, next) => {
  req.body.user = req.user.id;
  const task = await Task.create(req.body);

  res.status(201).json({
    success: true,
    data: task
  });
});

// @desc      Update task
// @route     PUT /api/v1/tasks/:id
// @access    Private
exports.updateTask = asyncHandler(async (req, res, next) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return next(
      new ErrorResponse(`No task with the id of ${req.params.id}`, 404)
    );
  }
  task = await Task.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: task
  });
});

// @desc      Delete task
// @route     DELETE /api/v1/tasks/:id
// @access    Private
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return next(
      new ErrorResponse(`No task with the id of ${req.params.id}`, 404)
    );
  }

  await task.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});
