const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const { findByEmail, createUser, updatePasswordById } = require('../models/userModel');

const isBcryptHash = (value) => typeof value === 'string' && /^\$2[aby]\$/.test(value);

const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, username, email, password, role } = req.body;
    const usernameValue = username || name;
    const existingUser = await findByEmail(email);

    console.log('Register attempt for:', email, 'username:', usernameValue);
    if (existingUser) {
      console.log('User found during register:', email);
      return res.status(409).json({ message: 'Email already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Register password hash for', email, hashedPassword);
    const user = await createUser(usernameValue, email, hashedPassword, role);

    return res.status(201).json({
      user: {
        id: user.id,
        username: user.username,
        name: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Register error:', error);
    return res.status(500).json({ message: 'Registration failed' });
  }
};

const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await findByEmail(email);

    console.log('Login attempt for:', email, 'User found:', !!user);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const storedPassword = user.password || '';
    console.log('Stored password hash/plaintext:', storedPassword);

    let isMatch = false;
    if (isBcryptHash(storedPassword)) {
      isMatch = await bcrypt.compare(password, storedPassword);
    } else {
      isMatch = storedPassword === password;
      if (isMatch) {
        const hashedPassword = await bcrypt.hash(password, 10);
        await updatePasswordById(user.id, hashedPassword);
        console.log(`Migrated plaintext password for ${email} during login`);
      }
    }

    console.log('Password comparison result:', isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '8h' }
    );

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        username: user.username,
        name: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ message: 'Login failed' });
  }
};

module.exports = { register, login };
