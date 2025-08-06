const express = require('express');
const router = express.Router();
const auth   = require('../middleware/auth');
const Diary  = require('../models/Diary');

/**
 * @route   POST /api/diary/new
 * @desc    Yeni günlük girişi ekle (text ve/veya audio)
 * @access  Private
 */
router.post('/new', auth, async (req, res) => {
  const { text, audioPath } = req.body;
  if (!text && !audioPath) {
    return res.status(400).json({ msg: 'En az metin veya ses yolu girilmeli' });
  }

  try {
    const entry = new Diary({
      user:  req.user.id,
      text:  text || '',
      audio: audioPath || ''
    });
    await entry.save();
    res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sunucu hatası');
  }
});

/**
 * @route   GET /api/diary/list
 * @desc    Kullanıcının tüm günlük girişlerini listele
 * @access  Private
 */
router.get('/list', auth, async (req, res) => {
  try {
    const entries = await Diary.find({ user: req.user.id }).sort({ date: -1 });
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).send('Sunucu hatası');
  }
});

module.exports = router;
