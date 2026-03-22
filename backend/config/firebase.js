const admin = require('firebase-admin');
const fs = require('fs');

if (fs.existsSync(process.env.FIREBASE_SERVICE_ACCOUNT_PATH)) {
  const serviceAccount = require('.' + process.env.FIREBASE_SERVICE_ACCOUNT_PATH);
  admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
} else {
  console.warn("Firebase service account file not found. Auth will fail.");
  admin.initializeApp();
}

module.exports = admin;