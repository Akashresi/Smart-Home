const pb = require('../config/pocketbase');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      // Verify token with PocketBase
      pb.authStore.save(token, null);
      const authData = await pb.collection('users').authRefresh();
      req.user = {
        uid: authData.record.id,
        email: authData.record.email,
        name: authData.record.name
      };
      next();
    } catch (error) {
      console.error('Auth error:', error.message);
      
      // FOR EASY LOCAL TESTING ONLY — keep the mock version temporarily:
      if (process.env.NODE_ENV === 'development') {
        req.user = { uid: 'mock-user-123', email: 'test@test.com', name: 'Test User' };
        return next();
      }

      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  } else {
    // FOR EASY LOCAL TESTING ONLY — keep the mock version temporarily:
    if (process.env.NODE_ENV === 'development') {
        req.user = { uid: 'mock-user-123', email: 'test@test.com', name: 'Test User' };
        return next();
    }

    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };