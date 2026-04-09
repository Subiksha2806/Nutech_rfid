/**
 * Database Seeder
 * 
 * Run this file to populate the database with sample data for testing.
 * Usage: npm run seed
 */

const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');
const Rack = require('./models/Rack');
const { SAMPLE_PRODUCTS, SAMPLE_RACKS } = require('./qr-codes/dummy-data');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/nutech-warehouse';

async function seedDatabase() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB\n');

    // Clear existing data
    console.log('Clearing existing data...');
    await Product.deleteMany({});
    await Rack.deleteMany({});
    console.log('Cleared existing data\n');

    // Create racks first
    console.log('Creating racks...');
    for (const rackData of SAMPLE_RACKS) {
      const rack = new Rack({
        rackId: rackData.rackId,
        name: rackData.name,
        location: 'Main Warehouse',
        capacity: 100,
        currentLoad: 0
      });
      await rack.save();
      console.log(`  ✓ Created rack: ${rackData.rackId}`);
    }
    console.log('');

    // Create sample products (already assigned to racks)
    console.log('Creating sample products...');
    
    // Assign first 3 products to RACK1
    for (let i = 0; i < 3 && i < SAMPLE_PRODUCTS.length; i++) {
      const p = SAMPLE_PRODUCTS[i];
      const product = new Product({
        productId: p.productId,
        name: p.name,
        manufactureDate: new Date(p.manufactureDate),
        manufacturer: p.manufacturer,
        location: p.location,
        rackId: 'RACK1',
        status: 'stored'
      });
      await product.save();
      console.log(`  ✓ Created product: ${p.productId} -> RACK1`);
    }

    // Assign next 3 products to RACK2
    for (let i = 3; i < 6 && i < SAMPLE_PRODUCTS.length; i++) {
      const p = SAMPLE_PRODUCTS[i];
      const product = new Product({
        productId: p.productId,
        name: p.name,
        manufactureDate: new Date(p.manufactureDate),
        manufacturer: p.manufacturer,
        location: p.location,
        rackId: 'RACK2',
        status: 'stored'
      });
      await product.save();
      console.log(`  ✓ Created product: ${p.productId} -> RACK2`);
    }

    console.log('\n✅ Database seeded successfully!');
    console.log(`   - ${SAMPLE_RACKS.length} racks created`);
    console.log(`   - ${SAMPLE_PRODUCTS.length} products created`);
    console.log('\nYou can now test the system with these samples.');

    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run seeder
seedDatabase();
