// backend/routes/entries.js
const express = require('express');
const router  = express.Router();
const auth    = require('../middleware/auth');
const Diary   = require('../models/Diary');
const { body, validationResult } = require('express-validator');

// @route   GET /api/entries
router.get('/', auth, async (req, res) => {
  try {
    const entries = await Diary.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(entries);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Sunucu hatası');
  }
});

// @route   POST /api/entries
router.post(
  '/',
  [ auth, body('text').notEmpty().withMessage('Metin boş olamaz') ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      const { text, keywords = [] } = req.body;
      const entry = new Diary({
        user: req.user.id,
        text,
        keywords
      });
      await entry.save();
      res.json(entry);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Sunucu hatası');
    }
  }
);

module.exports = router;
