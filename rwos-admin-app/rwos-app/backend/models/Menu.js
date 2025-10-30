const mongoose = require('mongoose');

const menuSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['Appetizer', 'Main Course', 'Dessert', 'Beverage'], 
    required: true 
  },
  price: { type: Number, required: true },
  description: { type: String, default: '' },
  imageUrl: { type: String, default: '' },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Menu', menuSchema);