const express = require('express');
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Yeni kullanıcı kaydı
 * @access  Public
 */
router.post(
  '/register',
  [
    check('name',     'İsim gerekli').notEmpty(),
    check('email',    'Geçerli e-posta girin').isEmail(),
    check('password', 'Şifre en az 6 karakter olmalı').isLength({ min: 6 })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) 
      return res.status(400).json({ errors: errors.array() });

    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) 
        return res.status(400).json({ msg: 'Bu e-posta zaten kayıtlı' });

      user = new User({ name, email, password });
      await user.save();

      const payload = { user: { id: user.id } };
      const token   = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' });
      res.status(201).json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).send('Sunucu hatası');
    }
  }
);

/**
 * @route   POST /api/auth/login
 * @desc    Mevcut kullanıcı girişi
 * @access  Public
 */
router.post(
  '/login',
  [
    check('email',    'Geçerli e-posta girin').isEmail(),
    check('password', 'Şifre zorunlu').exists()
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) 
      return res.status(400).json({ errors: errors.array() });

    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) 
        return res.status(400).json({ msg: 'Geçersiz kimlik bilgileri' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) 
        return res.status(400).json({ msg: 'Geçersiz kimlik bilgileri' });

      const payload = { user: { id: user.id } };
      const token   = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10h' });
      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).send('Sunucu hatası');
    }
  }
);

module.exports = router;
