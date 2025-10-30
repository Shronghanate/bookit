// backend/seed.js
require('dotenv').config();
const mongoose = require('mongoose');
const Experience = require('./models/Experience');

const experiences = [
  {
    title: "Sunrise Hike at Hilltop",
    description: "Watch the sunrise above the hills with a guided trek.",
    price: 799,
    currency: "INR",
    image: "https://plus.unsplash.com/premium_photo-1663091799148-386c863102d3?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170",
    location: "Pune",
  },
  {
    title: "City Food Walk",
    description: "Taste local delicacies with expert guides.",
    price: 999,
    currency: "INR",
    image: "https://images.unsplash.com/photo-1760263215713-a866691b58b2?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1165",
    location: "Mumbai",
  },
  {
    title: "Kayaking Adventure",
    description: "Experience kayaking with trained guides and gear.",
    price: 899,
    currency: "INR",
    image: "https://images.unsplash.com/photo-1480480565647-1c4385c7c0bf?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1931",
    location: "Udupi",
  },
  {
    title: "Coffee Plantation Trail",
    description: "Walk through lush plantations and learn coffee making.",
    price: 1299,
    currency: "INR",
    image: "https://images.unsplash.com/photo-1641243079795-7ac81a1c972e?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170",
    location: "Coorg",
  },
  {
    title: "Boat Cruise",
    description: "Enjoy a relaxing cruise through the scenic backwaters.",
    price: 999,
    currency: "INR",
    image: "https://images.unsplash.com/photo-1638123657021-f9aca72f8caf?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170",
    location: "Goa",
  },
  {
    title: "Mountain Biking",
    description: "Ride through rugged terrains with top-quality bikes.",
    price: 1499,
    currency: "INR",
    image: "https://plus.unsplash.com/premium_photo-1670002242828-35b26f965425?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1171",
    location: "Manali",
  },
  {
    title: "Desert Safari",
    description: "Thrilling jeep rides across sand dunes with dinner.",
    price: 1599,
    currency: "INR",
    image: "https://plus.unsplash.com/premium_photo-1661962428918-6a57ab674e23?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1170",
    location: "Jaisalmer",
  },
  {
    title: "Bungee Jumping",
    description: "Experience an adrenaline rush under expert supervision.",
    price: 1999,
    currency: "INR",
    image: "https://images.unsplash.com/photo-1549221360-456a9c197d5b?ixlib=rb-4.1.0&auto=format&fit=crop&q=80&w=1174",
    location: "Rishikesh",
  },
];

async function seedDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    await Experience.deleteMany({});
    await Experience.insertMany(experiences);
    console.log("✅ Seeded 8 experiences successfully!");
    mongoose.connection.close();
  } catch (err) {
    console.error(err);
    mongoose.connection.close();
  }
}

seedDB();
