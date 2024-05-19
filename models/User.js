// models/User.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['customer', 'restaurant'], required: true },
  points: { type: Map, of: Number, default: {} },
  qrCode: { type: String, default: '' },
});

module.exports = mongoose.model('User', UserSchema);
