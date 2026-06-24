const bcrypt = require('bcryptjs');
const { findByEmail, createUser, updatePasswordById, getAllUsers } = require('../models/userModel');

const defaultUsers = [
  {
    username: process.env.DEFAULT_ADMIN_USERNAME || 'admin',
    email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@fraud.com',
    password: process.env.DEFAULT_ADMIN_PASSWORD,
    role: 'ADMIN',
  },
  {
    username: process.env.DEFAULT_ANALYST_USERNAME || 'analyst',
    email: process.env.DEFAULT_ANALYST_EMAIL || 'analyst@fraud.com',
    password: process.env.DEFAULT_ANALYST_PASSWORD,
    role: 'ANALYST',
  },
];

const isBcryptHash = (value) => typeof value === 'string' && /^\$2[aby]\$/.test(value);

const migratePlaintextPasswords = async () => {
  const users = await getAllUsers();
  for (const user of users) {
    if (user.password && !isBcryptHash(user.password)) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await updatePasswordById(user.id, hashedPassword);
      console.log(`Migrated plain text password for user ${user.email}`);
    }
  }
};

const seedDefaultUsers = async () => {
  await migratePlaintextPasswords();
  for (const userData of defaultUsers) {
    if (!userData.password) {
      console.warn(`Skipping default user ${userData.email}: DEFAULT password not configured`);
      continue;
    }

    const existingUser = await findByEmail(userData.email);
    if (!existingUser) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await createUser(userData.username, userData.email, hashedPassword, userData.role);
      console.log(`Created default user ${userData.email} with role ${userData.role}`);
    }
  }
};

module.exports = { seedDefaultUsers, isBcryptHash };
