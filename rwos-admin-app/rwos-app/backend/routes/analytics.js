const express = require('express');
const Analytics = require('../models/Analytics');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const router = express.Router();

// Get analytics data
router.get('/:restaurantId', auth, async (req, res) => {
  try {
    const analytics = await Analytics.findOne({ restaurantId: req.params.restaurantId });
    if (!analytics) {
      return res.status(404).json({ message: 'Analytics not found' });
    }
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update analytics
router.post('/update/:restaurantId', auth, async (req, res) => {
  try {
    const orders = await Order.find({ restaurantId: req.params.restaurantId });
    const totalOrders = orders.length;
    const avgValue = orders.reduce((sum, order) => sum + order.total, 0) / totalOrders || 0;
    
    const analytics = await Analytics.findOneAndUpdate(
      { restaurantId: req.params.restaurantId },
      { totalOrders, avgValue },
      { upsert: true, new: true }
    );
    
    res.json(analytics);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;