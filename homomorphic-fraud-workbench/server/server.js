require('dotenv').config();
const app = require('./app');
const { connectDatabase, ensureTransactionUserIdColumn } = require('./config/db');
const { seedDefaultUsers } = require('./utils/userSetup');

const PORT = process.env.PORT || 5000;

const initializeServer = async () => {
  await connectDatabase();
  await ensureTransactionUserIdColumn();
  await seedDefaultUsers();
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
};

initializeServer().catch((error) => {
  console.error('Failed to initialize server:', error);
  process.exit(1);
});
