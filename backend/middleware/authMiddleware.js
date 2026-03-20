const admin = require('../config/firebase');

const protect = async (req, res, next) => {
  // Mock authentication for easy local dev
  req.user = { uid: 'mock-user-123' };
  next();
  // In production, verify token
  /*
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Not authorized' });
    }
  } else {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
  */
};

module.exports = { protect };
