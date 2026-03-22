const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const rateLimit = require('express-rate-limit');
require('./jobs/reminderJob'); // Start cron jobs

dotenv.config();
connectDB();

const app = express();

// Set up rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100 });
app.use(limiter);

// Restrict CORS
app.use(cors({ origin: [process.env.FRONTEND_URL || 'http://localhost:8081'] }));
app.use(express.json());

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
  res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));