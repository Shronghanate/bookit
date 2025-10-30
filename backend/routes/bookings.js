const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking");
const Experience = require("../models/Experience");

router.post("/", async (req, res) => {
  console.log("📩 Incoming booking payload:", req.body);

  try {
    const {
      experience,
      date,
      slot,
      userInfo,
      guests = 1,
      promoCode,
      totalPrice,
    } = req.body;

    // Basic validation
    if (!experience || !experience._id || !date || !slot || !userInfo) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Fetch experience from DB
    const exp = await Experience.findById(experience._id);
    if (!exp) return res.status(404).json({ error: "Experience not found" });

    // Find the slot
    const slotObj = exp.slots.find(
      (s) => s.date === date.split("T")[0] && s.slot === slot.time
    );
    if (!slotObj) return res.status(400).json({ error: "Slot not available" });

    // Check slot capacity
    if (slotObj.booked + guests > slotObj.capacity) {
      return res.status(400).json({ error: "Slot fully booked" });
    }

    // Increment booked count
    slotObj.booked += guests;
    await exp.save();

    // Create booking
    const booking = await Booking.create({
      experienceId: experience._id,
      experienceTitle: experience.title,
      date,
      slot: slot.time,
      user: userInfo,
      guests,
      promoCode,
      amountPaid: totalPrice,
    });

    res.json({
      success: true,
      message: "Booking confirmed successfully!",
      bookingId: booking._id,
      booking,
    });
  } catch (err) {
    console.error("Booking Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
