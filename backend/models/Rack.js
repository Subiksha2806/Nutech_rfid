const mongoose = require('mongoose');

/**
 * Rack Schema
 * Stores rack information and current capacity
 */
const rackSchema = new mongoose.Schema({
  rackId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  location: {
    type: String,
    default: 'Warehouse'
  },
  capacity: {
    type: Number,
    default: 100
  },
  currentLoad: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Rack', rackSchema);
