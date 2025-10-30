const mongoose = require('mongoose');

const SlotSchema = new mongoose.Schema({
  date: String,         // ISO date or '2025-11-01'
  slot: String,         // e.g. "10:00 - 12:00"
  capacity: Number,     // total seats
  booked: { type: Number, default: 0 } // number already booked
});

const ExperienceSchema = new mongoose.Schema({
  title: String,
  description: String,
  price: Number,
  currency: { type: String, default: 'INR' },
  image: String,
  location: String,
  slots: [SlotSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Experience', ExperienceSchema);
