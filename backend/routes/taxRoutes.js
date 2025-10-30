const express = require("express");
const router = express.Router();

// ✅ GET /api/taxes — return a fixed tax amount
router.get("/", (req, res) => {
  res.json({ tax: 59 }); // You can change 59 to any default tax value
});

module.exports = router;
