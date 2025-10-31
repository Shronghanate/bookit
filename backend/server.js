const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const experienceRoutes = require("./routes/experienceRoutes");

dotenv.config();
const app = express();

// ✅ Middleware
app.use(express.json());

// ✅ Improved CORS configuration (works for localhost + all Vercel subdomains)
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:3000", // local testing
        "https://bookit-65a9nml03-shronghanates-projects.vercel.app", // main deployed frontend
      ];

      // ✅ Allow requests with no origin (e.g., Postman, curl)
      if (!origin) return callback(null, true);

      // ✅ Allow all Vercel preview domains dynamically
      if (allowedOrigins.includes(origin) || /\.vercel\.app$/.test(origin)) {
        return callback(null, true);
      }

      // ❌ Block anything else
      return callback(new Error("Not allowed by CORS"));
    },
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
