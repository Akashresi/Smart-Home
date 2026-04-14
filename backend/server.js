const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const connectDB = require('./config/db');
const config = require('./config/config');
const rateLimit = require('express-rate-limit');
require('./jobs/reminderJob'); // Start cron jobs

// Connect to Database
connectDB();

const app = express();

// Security Headers
app.use(helmet());

// Set up rate limiting
const limiter = rateLimit({ 
  windowMs: 15 * 60 * 1000, 
  max: 100,
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use(limiter);

// Restrict CORS
app.use(cors({ origin: [config.cors.origin] }));
app.use(express.json());

// Auth limiter for sensitive routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: 'Too many login/registration attempts, please try again after 15 minutes'
});
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/register', authLimiter);

// Mount Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/tasks', require('./routes/taskRoutes'));
app.use('/api/cleaning', require('./routes/cleaningRoutes'));
app.use('/api/inventory', require('./routes/inventoryRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));
app.use('/api/maintenance', require('./routes/maintenanceRoutes'));
app.use('/api/alerts', require('./routes/alertRoutes'));
app.use('/api/household', require('./routes/householdRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    message: config.env === 'production' ? 'Internal server error' : err.message 
  });
});

const PORT = config.port;
app.listen(PORT, () => console.log(`Server running in ${config.env} mode on port ${PORT}`));