const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');

const initSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: [config.cors.origin, 'http://localhost:8081'],
      methods: ['GET', 'POST']
    }
  });

  // Authentication Middleware for Socket.io
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) return next(new Error('Authentication error: No token provided'));

      const decoded = jwt.verify(token, config.jwt.accessSecret);
      const user = await User.findById(decoded.id);

      if (!user) return next(new Error('Authentication error: User not found'));

      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Authentication error: Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    console.log(`User connected: ${socket.user.email} (${socket.id})`);

    // Join household-specific room
    if (socket.user.householdId) {
      const householdRoom = `household_${socket.user.householdId.toString()}`;
      socket.join(householdRoom);
      console.log(`User joined room: ${householdRoom}`);
    }

    socket.on('device:status_change', (data) => {
      // Broadcast status change to todos in the household room
      if (socket.user.householdId) {
        socket.to(`household_${socket.user.householdId.toString()}`).emit('device:status_updated', data);
      }
    });

    socket.on('disconnect', () => {
      console.log(`User disconnected: ${socket.id}`);
    });
  });

  return io;
};

module.exports = initSocket;
