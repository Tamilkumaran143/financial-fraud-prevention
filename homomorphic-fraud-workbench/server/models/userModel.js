const { getPool } = require('../config/db');

const findByEmail = async (email) => {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

const findById = async (id) => {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
  return rows[0];
};

const getAllUsers = async () => {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM users');
  return rows;
};

const createUser = async (username, email, password, role) => {
  const pool = getPool();
  const [result] = await pool.query(
    'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)',
    [username, email, password, role]
  );
  return findById(result.insertId);
};

const updatePasswordById = async (id, password) => {
  const pool = getPool();
  await pool.query('UPDATE users SET password = ? WHERE id = ?', [password, id]);
  return findById(id);
};

module.exports = { findByEmail, findById, createUser, getAllUsers, updatePasswordById };
