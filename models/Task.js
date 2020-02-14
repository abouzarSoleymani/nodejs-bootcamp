const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: [true, 'Please add a title for the task'],
    maxlength: 100
  },
  completed: {
    type: Boolean,
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },
  category: {
    type: [String],
  },
  startDate: {
    type: String,
    default: Date.now
  },
  endDate: {
    type: String,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  periodicity: {
    type: [String],
  },

});

module.exports = mongoose.model('Task', TaskSchema);
