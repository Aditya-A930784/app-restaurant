const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  totalOrders: { type: Number, default: 0 },
  avgValue: { type: Number, default: 0 },
  satisfaction: { type: Number, default: 0 },
  trendData: [{ type: Number }],
  date: { type: Date, default: Date.now }
}, { timestamps: true });

module.exports = mongoose.model('Analytics', analyticsSchema);