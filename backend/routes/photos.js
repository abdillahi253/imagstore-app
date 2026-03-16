import express from 'express';
import multer from 'multer';
import pool from '../db.js';
import jwt from 'jsonwebtoken';
import fs from 'fs';

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.sendStatus(401);
  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Upload photo
router.post('/upload', authenticateToken, upload.single('photo'), async (req, res) => {
  const { originalname, filename, path } = req.file;
  try {
    const result = await pool.query(
      'INSERT INTO photos (user_id, filename, originalname, path) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.user.id, filename, originalname, path]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List photos
router.get('/', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM photos WHERE user_id = $1', [req.user.id]);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
