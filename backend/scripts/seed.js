const mongoose = require('mongoose');
const User = require('../models/User');
const authService = require('../services/authService');
const config = require('../config/config');

const seedData = async () => {
  try {
    await mongoose.connect(config.mongodb.uri);
    console.log('Connected to MongoDB for seeding...');

    // Delete existing test user if any
    await User.deleteOne({ email: 'test@example.com' });

    const hashedPassword = await authService.hashPassword('TestPassword123!');
    
    const user = await User.create({
      email: 'test@example.com',
      password: hashedPassword,
      name: 'Test User',
      username: 'testuser',
      role: 'admin',
      isVerified: true
    });

    console.log('Seed data created: test@example.com / TestPassword123!');

    // Create API Key for AI Service
    const ApiKey = require('../models/ApiKey');
    const crypto = require('crypto');
    const aiKey = config.aiService.apiKey; // sk-dev-ai-service-key
    const hashedAiKey = crypto.createHash('sha256').update(aiKey).digest('hex');

    await ApiKey.deleteOne({ keyPrefix: 'sk-dev' });
    await ApiKey.create({
      name: 'AI Service Key',
      key: hashedAiKey,
      keyPrefix: 'sk-dev',
      userId: user._id,
      permissions: ['read', 'ai_access']
    });

    console.log('AI Service API Key seeded');
    process.exit(0);
  } catch (err) {
    console.error('Seeding failed:', err);
    process.exit(1);
  }
};

seedData();
