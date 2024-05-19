// routes/auth.js
const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const QRCode = require('qrcode');
const User = require('../models/User');
const Restaurant = require('../models/Restaurant')

// Register Customer
router.post('/register/customer', async (req, res) => {
  const { name, email, password } = req.body;
  const user = new User({ name, email, password: bcrypt.hashSync(password, 8), role: 'customer' });
  try {
    await user.save();
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' });
    const qrCode = await QRCode.toDataURL(user._id.toString());
    user.qrCode = qrCode;
    await user.save();
    res.status(201).send({ token, qrCode });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Register Restaurant
router.post('/register/restaurant', async (req, res) => {
  const { name, email, password, address, phone, description } = req.body;
  const restaurant = new Restaurant({ name, email, password: bcrypt.hashSync(password, 8), address, phone, description });
  try {
    await restaurant.save();
    const token = jwt.sign({ id: restaurant._id, role: 'restaurant' }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(201).send({ token });
  } catch (error) {
    res.status(400).send(error);
  }
});

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }) || await Restaurant.findOne({ email });
  if (!user || !bcrypt.compareSync(password, user.password)) {
    return res.status(401).send('Invalid email or password');
  }
  const token = jwt.sign({ id: user._id, role: user.role || 'restaurant' }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.send({ token });
});

// Logout
router.post('/logout', (req, res) => {
  res.send('Logout successful'); // Token management to be handled on the client-side
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email }) || await Restaurant.findOne({ email });
  if (!user) {
    return res.status(404).send('User not found');
  }
  // Implement password reset logic here (e.g., send email with reset link)
  res.send('Password reset link sent');
});

module.exports = router;
