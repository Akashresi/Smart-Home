const Expense = require('../models/Expense');

const getExpenses = async (req, res) => {
  try {
    const expenses = await Expense.find({ userId: req.user.uid });
    res.json(expenses);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const createExpense = async (req, res) => {
  try {
    const expense = await Expense.create({ ...req.body, userId: req.user.uid });
    res.status(201).json(expense);
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

const deleteExpense = async (req, res) => {
  try {
    const result = await Expense.findOneAndDelete({ _id: req.params.id, userId: req.user.uid });
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (error) { res.status(500).json({ message: 'Server error' }); }
};

module.exports = { getExpenses, createExpense, deleteExpense };