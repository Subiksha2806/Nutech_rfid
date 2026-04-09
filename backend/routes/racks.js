const express = require('express');
const router = express.Router();
const Rack = require('../models/Rack');
const Product = require('../models/Product');
const Movement = require('../models/Movement');

/**
 * @route   GET /api/racks
 * @desc    Get all racks
 */
router.get('/', async (req, res) => {
  try {
    const racks = await Rack.find().sort({ rackId: 1 });
    res.json({ success: true, count: racks.length, data: racks });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   GET /api/racks/:rackId
 * @desc    Get rack by ID with all products in it
 */
router.get('/:rackId', async (req, res) => {
  try {
    const rack = await Rack.findOne({ rackId: req.params.rackId });
    
    if (!rack) {
      // Auto-create rack if not found (for QR scan workflow)
      const newRack = new Rack({
        rackId: req.params.rackId,
        name: `Rack ${req.params.rackId}`
      });
      await newRack.save();
      
      const products = [];
      return res.json({ 
        success: true, 
        data: { rack: newRack, products } 
      });
    }
    
    // Get all products in this rack
    const products = await Product.find({ 
      rackId: req.params.rackId,
      status: 'stored'
    });
    
    res.json({ 
      success: true, 
      data: { rack, products } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   POST /api/racks
 * @desc    Create new rack
 */
router.post('/', async (req, res) => {
  try {
    const { rackId, name, location, capacity } = req.body;
    
    // Check if rack already exists
    const existingRack = await Rack.findOne({ rackId });
    if (existingRack) {
      return res.status(400).json({ success: false, error: 'Rack already exists' });
    }
    
    const rack = new Rack({
      rackId,
      name,
      location,
      capacity
    });
    
    await rack.save();
    res.status(201).json({ success: true, data: rack });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   GET /api/racks/:rackId/products
 * @desc    Get all products in a specific rack
 */
router.get('/:rackId/products', async (req, res) => {
  try {
    const products = await Product.find({ 
      rackId: req.params.rackId,
      status: { $ne: 'dispatched' }
    });
    
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   GET /api/movements
 * @desc    Get movement history
 */
router.get('/movements/all', async (req, res) => {
  try {
    const movements = await Movement.find()
      .sort({ timestamp: -1 })
      .limit(100);
    res.json({ success: true, count: movements.length, data: movements });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
