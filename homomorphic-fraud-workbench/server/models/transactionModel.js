const { getPool } = require('../config/db');

const normalizeTransaction = (row) => ({
  id: row.id,
  account_number: row.account_number,
  amount: row.amount,
  merchant: row.merchant,
  location: row.location,
  transaction_time: row.transaction_time,
  encrypted_value: row.encrypted_value,
  fraud_score: row.fraud_score,
  status: row.fraud_status || 'PENDING',
  risk_level: row.fraud_status || 'LOW',
  bank_id: row.bank_id,
  bank_name: row.bank_name,
  user_name: row.user_name,
  created_at: row.created_at,
});

const getAllTransactions = async () => {
  const pool = getPool();
  const [rows] = await pool.query(
    'SELECT t.id, t.account_number, t.amount, t.merchant, t.location, t.transaction_time, t.encrypted_value, t.fraud_score, t.fraud_status, t.bank_id, t.created_at, b.bank_name AS bank_name, u.username AS user_name FROM transactions t JOIN banks b ON t.bank_id = b.id LEFT JOIN users u ON t.user_id = u.id ORDER BY t.transaction_time DESC'
  );
  return rows.map(normalizeTransaction);
};

const getTransactionById = async (id) => {
  const pool = getPool();
  const [rows] = await pool.query(
    'SELECT t.id, t.account_number, t.amount, t.merchant, t.location, t.transaction_time, t.encrypted_value, t.fraud_score, t.fraud_status, t.bank_id, t.created_at, b.bank_name AS bank_name, u.username AS user_name FROM transactions t JOIN banks b ON t.bank_id = b.id LEFT JOIN users u ON t.user_id = u.id WHERE t.id = ?',
    [id]
  );
  if (!rows.length) return null;
  return normalizeTransaction(rows[0]);
};

const createTransaction = async (transaction) => {
  const pool = getPool();
  const {
    bank_id,
    user_id,
    account_number,
    amount,
    merchant,
    location,
    transaction_time,
    fraud_score,
    fraud_status,
    encrypted_value,
  } = transaction;
  const [result] = await pool.query(
    'INSERT INTO transactions (bank_id, user_id, account_number, amount, merchant, location, transaction_time, encrypted_value, fraud_score, fraud_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
    [bank_id, user_id, account_number, amount, merchant, location, transaction_time, encrypted_value, fraud_score, fraud_status]
  );
  return getTransactionById(result.insertId);
};

const updateTransaction = async (id, transaction) => {
  const pool = getPool();
  const {
    bank_id,
    user_id,
    account_number,
    amount,
    merchant,
    location,
    transaction_time,
    fraud_score,
    fraud_status,
    encrypted_value,
  } = transaction;
  await pool.query(
    'UPDATE transactions SET bank_id = ?, user_id = ?, account_number = ?, amount = ?, merchant = ?, location = ?, transaction_time = ?, encrypted_value = ?, fraud_score = ?, fraud_status = ? WHERE id = ?',
    [bank_id, user_id, account_number, amount, merchant, location, transaction_time, encrypted_value, fraud_score, fraud_status, id]
  );
  return getTransactionById(id);
};

const deleteTransaction = async (id) => {
  const pool = getPool();
  await pool.query('DELETE FROM transactions WHERE id = ?', [id]);
  return true;
};

const getRecentTransactionsByUser = async (user_id) => {
  const pool = getPool();
  const [rows] = await pool.query(
    'SELECT * FROM transactions WHERE user_id = ? ORDER BY transaction_time DESC LIMIT 20',
    [user_id]
  );
  return rows.map((row) => ({
    ...row,
    status: row.fraud_status || 'PENDING',
    risk_level: row.fraud_status || 'LOW',
  }));
};

module.exports = {
  getAllTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getRecentTransactionsByUser,
};
