const mongoose = require('mongoose');
const { Schema } = mongoose;
const { encrypt, decrypt } = require('./utils/encryption');

const AcadtaskSchema = new Schema({
  userId: {
    type: String,  // Changed from ObjectId to String
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    set: encrypt,
    get: decrypt
  },
  description: {
    type: String,
    default: '',
    set: encrypt,
    get: decrypt
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],  // Changed to lowercase to match frontend
    required: true,
    set: encrypt,
    get: decrypt
  },
  deadline: {
    type: Date,
    required: true
  },
  subject: {
    type: String,  // Changed from ObjectId to String
    required: true,
    set: encrypt,
    get: decrypt
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

// Enable getters for all queries
AcadtaskSchema.set('toObject', { getters: true });
AcadtaskSchema.set('toJSON', { getters: true });

module.exports = mongoose.model('AcadTask', AcadtaskSchema);
