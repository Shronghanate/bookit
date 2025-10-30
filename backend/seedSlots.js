import mongoose from "mongoose";
import dotenv from "dotenv";
import Experience from "./models/experience.js"; // ✅ Correct import path

dotenv.config();

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Generate 5 future dates × 4 slots each
const generateSlots = () => {
  const slots = [];
  const today = new Date();

  for (let i = 0; i < 5; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split("T")[0]; // yyyy-mm-dd

    const times = [
      "6:00 AM - 8:00 AM",
      "9:00 AM - 11:00 AM",
      "2:00 PM - 4:00 PM",
      "5:00 PM - 7:00 PM",
    ];

    times.forEach((slot) => {
      slots.push({
        date: dateStr,
        slot,
        capacity: 10,
        booked: Math.floor(Math.random() * 5), // Random bookings for realism
      });
    });
  }

  return slots;
};

const seedSlots = async () => {
  try {
    const experiences = await Experience.find();

    if (!experiences.length) {
      console.log("⚠️ No experiences found in DB.");
      process.exit(0);
    }

    for (const exp of experiences) {
      exp.slots = generateSlots();
      await exp.save();
      console.log(`✅ Added 5 dates × 4 slots to: ${exp.title}`);
    }

    console.log("🎉 Successfully seeded all experiences with slots!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Error seeding slots:", err);
    process.exit(1);
  }
};

seedSlots();
