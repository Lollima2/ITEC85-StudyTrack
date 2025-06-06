const mongoose = require('mongoose');
const { Schema } = mongoose;

const AcadtaskSchema = new Schema({
  userId: {
    type: String,  // Changed from ObjectId to String
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    default: ''
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],  // Changed to lowercase to match frontend
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  subject: {
    type: String,  // Changed from ObjectId to String
    required: true
  },
  completed: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Add a pre-save hook to update the updatedAt field
AcadtaskSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('AcadTask', AcadtaskSchema);
