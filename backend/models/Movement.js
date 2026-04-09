const mongoose = require('mongoose');

/**
 * Movement Schema
 * Tracks all product movements for audit trail
 */
const movementSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    index: true
  },
  productName: {
    type: String,
    required: true
  },
  fromRackId: {
    type: String,
    default: null
  },
  toRackId: {
    type: String,
    required: true
  },
  action: {
    type: String,
    enum: ['added', 'moved', 'dispatched'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  performedBy: {
    type: String,
    default: 'System'
  }
});

module.exports = mongoose.model('Movement', movementSchema);
