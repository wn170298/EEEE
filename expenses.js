// api/expenses.js

// In-memory storage for expenses
let expenses = [];

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Return all expenses
  if (req.method === 'GET') {
    return res.status(200).json({
      success: true,
      count: expenses.length,
      data: expenses
    });
  }

  // POST: Add a new expense
  if (req.method === 'POST') {
    try {
      const { description, amount, category, date } = req.body;

      // Validate required fields
      if (!description) {
        return res.status(400).json({
          success: false,
          error: 'Missing required field: description'
        });
      }

      if (!amount) {
        return res.status(400).json({
          success: false,
          error: 'Missing required field: amount'
        });
      }

      // Validate amount is a number
      const numAmount = parseFloat(amount);
      if (isNaN(numAmount)) {
        return res.status(400).json({
          success: false,
          error: 'Amount must be a valid number'
        });
      }

      // Create new expense
      const newExpense = {
        id: expenses.length + 1,
        description,
        amount: numAmount,
        category: category || 'Uncategorized',
        date: date || new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      expenses.push(newExpense);

      return res.status(201).json({
        success: true,
        message: 'Expense added successfully',
        data: newExpense
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        error: 'Server error: ' + error.message
      });
    }
  }

  // Method not allowed
  return res.status(405).json({
    success: false,
    error: `Method ${req.method} not allowed`
  });
}
