const mongoose = require('mongoose');

const BookingSchema = new mongoose.Schema({
  experienceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Experience' },
  user: {
    name: String,
    email: String,
    phone: String
  },
  date: String,
  slot: String,
  guests: { type: Number, default: 1 },
  promoCode: String,
  amountPaid: Number,
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', BookingSchema);
