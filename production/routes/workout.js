const express = require('express');
const router = express.Router();
const Workout = require('../models/Workout');
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Geen token gevonden' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: 'Ongeldige token' });
    }
    req.user = user;
    next();
  });
};

// Get all workouts
router.get('/', authenticateToken, async (req, res) => {
  try {
    const workouts = await Workout.find().sort({ date: -1 });
    res.json(workouts);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create new workout
router.post('/', authenticateToken, async (req, res) => {
  try {
    const workout = new Workout(req.body);
    await workout.save();
    res.status(201).json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update workout
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const workout = await Workout.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(workout);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router; 