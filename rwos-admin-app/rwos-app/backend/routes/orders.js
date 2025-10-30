const express = require('express');
const Order = require('../models/Order');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all orders
router.get('/', auth, async (req, res) => {
  try {
    const { status, tableNo, assignedTo } = req.query;
    const filter = { restaurantId: req.user.restaurantId };
    
    if (status) filter.status = status;
    if (tableNo) filter.tableNo = tableNo;
    if (assignedTo) filter.assignedTo = assignedTo;

    const orders = await Order.find(filter).populate('assignedTo', 'name').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create order
router.post('/', auth, async (req, res) => {
  try {
    const { tableNo, items, assignedTo } = req.body;
    const total = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const orderId = `ORD${Date.now()}`;

    const order = new Order({
      orderId,
      restaurantId: req.user.restaurantId,
      tableNo,
      items,
      total,
      assignedTo
    });

    await order.save();
    req.io.to(req.user.restaurantId.toString()).emit('order_created', order);
    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update order status
router.put('/:id', auth, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    
    req.io.to(req.user.restaurantId.toString()).emit('order_updated', order);
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete order
router.delete('/:id', auth, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    req.io.to(req.user.restaurantId.toString()).emit('order_deleted', req.params.id);
    res.json({ message: 'Order deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;