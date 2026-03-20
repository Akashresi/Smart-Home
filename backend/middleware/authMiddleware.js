const admin = require('../config/firebase');

const protect = async (req, res, next) => {
  // Mock authentication for easy local dev
  req.user = { uid: 'mock-user-123', role: 'admin' }; // setting mock role as admin for testing
  next();
  // In production, verify token and fetch user role from DB:
  /*
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      const User = require('../models/User');
      const dbUser = await User.findOne({ uid: decodedToken.uid });
      req.user = { ...decodedToken, role: dbUser ? dbUser.role : 'user' };
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
  */
};

const adminProtect = async (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Not authorized as an admin' });
  }
};

module.exports = { protect, adminProtect };
