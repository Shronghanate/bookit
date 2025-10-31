const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const experienceRoutes = require("./routes/experienceRoutes");

dotenv.config();
const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ Corrected CORS configuration (works for both local + Vercel)
app.use(
  cors({
    origin: [
      "http://localhost:3000", // local testing
      "https://bookit-65a9nml03-shronghanates-projects.vercel.app", // Vercel frontend
    ],
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// ✅ MongoDB connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Routes
app.use("/api/experiences", experienceRoutes);
app.use("/api/taxes", require("./routes/taxRoutes"));
app.use("/api/bookings", require("./routes/bookings"));

// ✅ Default route
app.get("/", (req, res) => {
  res.send("Backend is running successfully 🚀");
});

// ✅ Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
