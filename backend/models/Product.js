const mongoose = require('mongoose');

/**
 * Product Schema
 * Stores all product information from QR codes and their current location
 */
const productSchema = new mongoose.Schema({
  productId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  manufactureDate: {
    type: Date,
    required: true
  },
  manufacturer: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  rackId: {
    type: String,
    default: null,
    index: true
  },
  status: {
    type: String,
    enum: ['stored', 'dispatched', 'in_transit'],
    default: 'stored'
  }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

module.exports = mongoose.model('Product', productSchema);
