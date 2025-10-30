const express = require('express');
const Menu = require('../models/Menu');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all menu items
router.get('/', auth, async (req, res) => {
  try {
    const { category, status } = req.query;
    const filter = { restaurantId: req.user.restaurantId };
    
    if (category) filter.category = category;
    if (status) filter.status = status;

    const menuItems = await Menu.find(filter).sort({ category: 1, name: 1 });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create menu item
router.post('/', auth, async (req, res) => {
  try {
    const { name, category, price, description, imageUrl } = req.body;
    const menuItem = new Menu({
      name,
      category,
      price,
      description,
      imageUrl,
      restaurantId: req.user.restaurantId
    });

    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update menu item
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, category, price, description, imageUrl, status } = req.body;
    const menuItem = await Menu.findByIdAndUpdate(
      req.params.id,
      { name, category, price, description, imageUrl, status },
      { new: true }
    );
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete menu item
router.delete('/:id', auth, async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: 'Menu item deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;