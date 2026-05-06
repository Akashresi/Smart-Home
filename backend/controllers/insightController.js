const Task = require('../models/Task');
const Expense = require('../models/Expense');
const Maintenance = require('../models/Maintenance');
const Cleaning = require('../models/Cleaning');

const getMonthlyInsights = async (req, res) => {
  try {
    const householdId = req.user.householdId;
    if (!householdId) {
      return res.status(403).json({ message: 'Forbidden: You must belong to a household to access this resource' });
    }

    // Calculate the date 30 days ago
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const query = {
      householdId,
      createdAt: { $gte: thirtyDaysAgo }
    };

    const expenseQuery = {
      householdId,
      date: { $gte: thirtyDaysAgo }
    };

    const [tasks, expenses, maintenance, cleaning] = await Promise.all([
      Task.find(query),
      Expense.find(expenseQuery),
      Maintenance.find(query),
      Cleaning.find(query)
    ]);

    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const pendingTasks = tasks.length - completedTasks;

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);

    const completedMaintenance = maintenance.filter(m => m.status === 'completed').length;
    
    const completedCleaning = cleaning.filter(c => c.status === 'completed').length;

    const report = {
      period: 'Last 30 Days',
      tasks: {
        total: tasks.length,
        completed: completedTasks,
        pending: pendingTasks
      },
      expenses: {
        totalSpent: totalSpent
      },
      maintenance: {
        total: maintenance.length,
        completed: completedMaintenance,
        pending: maintenance.length - completedMaintenance
      },
      cleaning: {
        total: cleaning.length,
        completed: completedCleaning,
        pending: cleaning.length - completedCleaning
      }
    };

    res.json({ report });
  } catch (error) {
    console.error('getMonthlyInsights Error:', error);
    res.status(500).json({ message: 'Server error generating insights' });
  }
};

module.exports = { getMonthlyInsights };
