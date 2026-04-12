const admin = require('firebase-admin');
const path = require('path');
require('dotenv').config();

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (serviceAccountPath) {
  try {
    const absolutePath = path.isAbsolute(serviceAccountPath) 
      ? serviceAccountPath 
      : path.join(process.cwd(), serviceAccountPath);
    
    const serviceAccount = require(absolutePath);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin initialized with service account.');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin with service account:', error.message);
    admin.initializeApp();
  }
} else {
  console.warn('FIREBASE_SERVICE_ACCOUNT_PATH not found, initializing with default credentials.');
  admin.initializeApp();
}

module.exports = admin;