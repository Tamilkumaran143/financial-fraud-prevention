const { getPool } = require('../config/db');

const normalizeBank = (row) => ({
  id: row.id,
  bank_name: row.bank_name,
  branch: row.branch,
  email: row.email,
  phone: row.phone,
  address: row.address,
  created_at: row.created_at,
  updated_at: row.updated_at,
});

const getAllBanks = async () => {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM banks ORDER BY created_at DESC');
  return rows.map(normalizeBank);
};

const getBankById = async (id) => {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM banks WHERE id = ?', [id]);
  if (!rows.length) return null;
  return normalizeBank(rows[0]);
};

const createBank = async (bank) => {
  const pool = getPool();
  const bankName = bank.bank_name || bank.name || 'Unnamed Bank';
  const branch = bank.branch || 'Main';
  const email = bank.email || bank.bank_email || 'support@unknown.com';
  const phone = bank.phone || bank.contact || '0000000000';
  const address = bank.address || bank.country || bank.location || 'Unknown address';
  const [result] = await pool.query(
    'INSERT INTO banks (bank_name, branch, email, phone, address) VALUES (?, ?, ?, ?, ?)',
    [bankName, branch, email, phone, address]
  );
  return getBankById(result.insertId);
};

const updateBank = async (id, bank) => {
  const pool = getPool();
  const bankName = bank.bank_name || bank.name || 'Unnamed Bank';
  const branch = bank.branch || 'Main';
  const email = bank.email || bank.bank_email || 'support@unknown.com';
  const phone = bank.phone || bank.contact || '0000000000';
  const address = bank.address || bank.country || bank.location || 'Unknown address';
  await pool.query(
    'UPDATE banks SET bank_name = ?, branch = ?, email = ?, phone = ?, address = ? WHERE id = ?',
    [bankName, branch, email, phone, address, id]
  );
  return getBankById(id);
};

const deleteBank = async (id) => {
  const pool = getPool();
  await pool.query('DELETE FROM banks WHERE id = ?', [id]);
  return true;
};

module.exports = { getAllBanks, getBankById, createBank, updateBank, deleteBank };
