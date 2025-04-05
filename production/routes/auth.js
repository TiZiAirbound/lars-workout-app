const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Hardcoded credentials (in a real app, this would be in a database)
const USERNAME = 'Lars';
const PASSWORD = 'Nadal2014';

router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (username === USERNAME && password === PASSWORD) {
    const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Ongeldige gebruikersnaam of wachtwoord' });
  }
});

module.exports = router; 