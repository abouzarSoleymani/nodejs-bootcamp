const express = require('express');
const {
  getTasks,
  getTask,
  addTask,
  updateTask,
  deleteTask
} = require('../controllers/tasks');
const Task = require('../models/Task');
const advancedResults = require('../middleware/advancedResults');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(protect, authorize('user', 'admin'),advancedResults(Task),getTasks)
  .post(protect, authorize('user', 'admin'),addTask);

router
  .route('/:id')
  .get(getTask)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
