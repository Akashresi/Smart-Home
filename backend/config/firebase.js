const admin = require('firebase-admin');

// Ensure you download your service account key and reference it here
// const serviceAccount = require('./path/to/serviceAccountKey.json');

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount)
// });

module.exports = admin;
