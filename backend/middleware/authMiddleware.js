const admin = require('../config/firebase');

const protect = async (req, res, next) => {
  const header = req.headers.authorization;

  // Development Fallback Mock
  if (process.env.NODE_ENV === 'development' && (!header || !header.startsWith('Bearer '))) {
    console.warn('Falling back to mock user in development mode');
    req.user = { uid: 'mock-user-123', email: 'mock@example.com' };
    return next();
  }

  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const token = header.split(' ')[1];
    const decodedToken = await admin.auth().verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Firebase Auth Error:', error.message);
    
    // Additional dev fallback for invalid tokens
    if (process.env.NODE_ENV === 'development') {
      console.warn('Invalid token, falling back to mock user in development mode');
      req.user = { uid: 'mock-user-123', email: 'mock@example.com' };
      return next();
    }
    
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
};

module.exports = { protect };