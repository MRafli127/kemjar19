import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import { logger } from '../utils/logger.js';

const router = express.Router();

// Simple in-memory user storage (replace with database in production)
const users = new Map();

// Validation schemas
const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  password: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

// Register endpoint
router.post('/register', async (req, res) => {
  try {
    const { error, value } = registerSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ 
        success: false, 
        error: error.details[0].message 
      });
    }

    const { username, password } = value;

    // Check if user already exists
    if (users.has(username)) {
      return res.status(400).json({ 
        success: false, 
        error: 'Username already exists' 
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Store user
    users.set(username, {
      username,
      password: hashedPassword,
      createdAt: new Date()
    });

    logger.info(`New user registered: ${username}`);

    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully' 
    });
  } catch (error) {
    logger.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Registration failed' 
    });
  }
});

// Login endpoint
router.post('/login', async (req, res) => {
  try {
    const { error, value } = loginSchema.validate(req.body);
    
    if (error) {
      return res.status(400).json({ 
        success: false, 
        error: error.details[0].message 
      });
    }

    const { username, password } = value;

    // Check admin credentials
    if (username === process.env.ADMIN_USERNAME) {
      if (password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign(
          { username, role: 'admin' },
          process.env.JWT_SECRET,
          { expiresIn: process.env.JWT_EXPIRE }
        );

        logger.info(`Admin login: ${username}`);

        return res.json({ 
          success: true, 
          token,
          user: { username, role: 'admin' }
        });
      }
    }

    // Check regular user
    const user = users.get(username);

    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    // Verify password
    const isValid = await bcrypt.compare(password, user.password);

    if (!isValid) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { username, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    logger.info(`User login: ${username}`);

    res.json({ 
      success: true, 
      token,
      user: { username, role: 'user' }
    });
  } catch (error) {
    logger.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Login failed' 
    });
  }
});

// Anonymous login endpoint
router.post('/anonymous', (req, res) => {
  try {
    const anonymousId = `anon_${Date.now()}`;
    
    const token = jwt.sign(
      { username: anonymousId, role: 'anonymous' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    logger.info(`Anonymous login: ${anonymousId}`);

    res.json({ 
      success: true, 
      token,
      user: { username: anonymousId, role: 'anonymous' }
    });
  } catch (error) {
    logger.error('Anonymous login error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Anonymous login failed' 
    });
  }
});

// Verify token endpoint
router.get('/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: 'No token provided' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    res.json({ 
      success: true, 
      user: decoded 
    });
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      error: 'Invalid token' 
    });
  }
});

export default router;
