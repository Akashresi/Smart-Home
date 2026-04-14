const pb = require('../config/pocketbase');

const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      // Verify token with PocketBase using a fresh instance per request
      const PocketBase = require('pocketbase/cjs');
      const pbInstance = new PocketBase(process.env.POCKETBASE_URL || 'http://127.0.0.1:8090');
      pbInstance.authStore.save(token, null);
      const authData = await pbInstance.collection('users').authRefresh();
      req.user = {
        uid: authData.record.id,
        email: authData.record.email,
        name: authData.record.name
      };
      next();
    } catch (error) {
      console.error('Auth error:', error.message);
      return res.status(401).json({ message: 'Not authorized, invalid token' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

module.exports = { protect };