const mongoose = require('mongoose');

const RequestLogSchema = new mongoose.Schema({
    ip: {
        type: String,
    },
    method: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});
