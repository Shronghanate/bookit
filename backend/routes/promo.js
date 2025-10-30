const express = require('express');
const router = express.Router();

// hardcoded sample promos (can later move to DB)
const promos = {
  SAVE10: { type: 'percent', value: 10 },
  FLAT100: { type: 'flat', value: 100 }
};

// POST /promo/validate
router.post('/validate', (req, res) => {
  const { code, amount } = req.body;
  if (!code) return res.status(400).json({ error: 'No code provided' });

  const promo = promos[code.toUpperCase()];
  if (!promo) return res.json({ valid: false });

  // compute discount example
  let discount = 0;
  if (promo.type === 'percent' && amount) discount = (amount * promo.value) / 100;
  if (promo.type === 'flat') discount = promo.value;

  res.json({ valid: true, code: code.toUpperCase(), discount });
});

module.exports = router;
