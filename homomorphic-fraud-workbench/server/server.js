require('dotenv').config();
const app = require('./app');
const { connectDatabase, ensureTransactionUserIdColumn } = require('./config/db');
const { seedDefaultUsers } = require('./utils/userSetup');

const DEFAULT_PORT = Number(process.env.PORT) || 5000;

const startServer = async (port = DEFAULT_PORT, attempt = 1) => {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
      resolve(server);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE' && attempt < 10) {
        console.warn(`Port ${port} is busy. Trying ${port + 1}...`);
        server.close(() => resolve(startServer(port + 1, attempt + 1)));
      } else {
        reject(error);
      }
    });
  });
};

const initializeServer = async () => {
  await connectDatabase();
  await ensureTransactionUserIdColumn();
  await seedDefaultUsers();
  await startServer();
};

initializeServer().catch((error) => {
  console.error('Failed to initialize server:', error);
  process.exit(1);
});
