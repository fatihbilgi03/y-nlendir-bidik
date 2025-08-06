const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const auth = require('../middleware/auth');
const DiaryEntry = require('../models/DiaryEntry');

// depolama ayarları
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, req.user.id + '-' + unique + ext);
  }
});
const fileFilter = (_req, file, cb) => {
    const allowed = ['audio/mpeg', 'audio/mp3', 'audio/wav'];
    cb(null, allowed.includes(file.mimetype));
};
const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/', auth, upload.single('audio'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ msg: 'Dosya yüklenmedi' });
    const entry = new DiaryEntry({
      user: req.user.id,
      audioURL: `/uploads/${req.file.filename}`
    });
    await entry.save();
    res.json(entry);
  } catch (err) {
    res.status(500).json({ msg: 'Sunucu hatası' });
  }
});

module.exports = router;
