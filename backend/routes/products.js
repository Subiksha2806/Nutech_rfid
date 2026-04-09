const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Movement = require('../models/Movement');

/**
 * @route   GET /api/products
 * @desc    Get all products
 */
router.get('/', async (req, res) => {
  try {
    const { status, rackId, search } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (rackId) query.rackId = rackId;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { productId: { $regex: search, $options: 'i' } }
      ];
    }
    
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, data: products });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   GET /api/products/:productId
 * @desc    Get single product by ID
 */
router.get('/:productId', async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.productId });
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   POST /api/products
 * @desc    Add new product (from QR scan)
 */
router.post('/', async (req, res) => {
  try {
    const { productId, name, manufactureDate, manufacturer, location, rackId } = req.body;
    
    // Check if product already exists
    let product = await Product.findOne({ productId });
    
    if (product) {
      // Update existing product with new rack
      product.rackId = rackId;
      product.status = 'stored';
      await product.save();
    } else {
      // Create new product
      product = new Product({
        productId,
        name,
        manufactureDate: new Date(manufactureDate),
        manufacturer,
        location,
        rackId,
        status: 'stored'
      });
      await product.save();
    }
    
    // Log movement
    await Movement.create({
      productId,
      productName: name,
      toRackId: rackId,
      fromRackId: null,
      action: 'added'
    });
    
    res.status(201).json({ 
      success: true, 
      message: `Product successfully added to ${rackId}`,
      data: product 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   PUT /api/products/:productId/move
 * @desc    Move product to new rack
 */
router.put('/:productId/move', async (req, res) => {
  try {
    const { newRackId } = req.body;
    const product = await Product.findOne({ productId: req.params.productId });
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    const oldRackId = product.rackId;
    
    // Update product rack
    product.rackId = newRackId;
    await product.save();
    
    // Log movement
    await Movement.create({
      productId: req.params.productId,
      productName: product.name,
      fromRackId: oldRackId,
      toRackId: newRackId,
      action: 'moved'
    });
    
    res.json({
      success: true,
      message: `Product moved successfully from ${oldRackId} to ${newRackId}`,
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route   PUT /api/products/:productId/dispatch
 * @desc    Dispatch product (remove from rack)
 */
router.put('/:productId/dispatch', async (req, res) => {
  try {
    const product = await Product.findOne({ productId: req.params.productId });
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }
    
    const oldRackId = product.rackId;
    
    // Update product status
    product.status = 'dispatched';
    product.rackId = null;
    await product.save();
    
    // Log movement
    await Movement.create({
      productId: req.params.productId,
      productName: product.name,
      fromRackId: oldRackId,
      toRackId: 'DISPATCHED',
      action: 'dispatched'
    });
    
    res.json({
      success: true,
      message: 'Product dispatched successfully',
      data: product
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
