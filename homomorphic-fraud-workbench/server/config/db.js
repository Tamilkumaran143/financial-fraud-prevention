const mysql = require('mysql2/promise');

let pool;

const connectDatabase = async () => {
  try {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'fraud_workbench',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    const connection = await pool.getConnection();
    await connection.ping();
    connection.release();
    console.log(`Connected to MySQL database at ${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 3306}`);
  } catch (error) {
    console.error('Unable to connect to database:', error.message);
    process.exit(1);
  }
};

const getPool = () => {
  if (!pool) {
    throw new Error('Database pool not initialized');
  }
  return pool;
};

const ensureTransactionUserIdColumn = async () => {
  const pool = getPool();
  const [rows] = await pool.query("SHOW COLUMNS FROM transactions LIKE 'user_id'");
  if (rows.length === 0) {
    console.log('Adding missing transactions.user_id column to database');
    await pool.query('ALTER TABLE transactions ADD COLUMN user_id INT NULL AFTER bank_id');
    await pool.query('ALTER TABLE transactions ADD INDEX idx_transaction_user (user_id)');
    try {
      await pool.query(
        'ALTER TABLE transactions ADD CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL'
      );
    } catch (error) {
      console.warn('Could not add foreign key constraint for transactions.user_id:', error.message);
    }
  }
};

module.exports = { connectDatabase, getPool, ensureTransactionUserIdColumn };
