const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

// Get user profile
router.get('/', auth, async (req, res) => {
  try {
    // Profile logic here
    res.json({ message: 'Profile route working' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;