// models/Restaurant.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RestaurantSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  description: { type: String },
  pointSettings: { type: Array, default: [] },
  redemptionThreshold: { type: Number, default: 200 },
  redemptionItems: { type: Array, default: [] },
});

module.exports = mongoose.model('Restaurant', RestaurantSchema);
