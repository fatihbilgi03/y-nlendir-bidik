// backend/server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { initSchedulers } = require('./schedulers/cronRunner');

const app = express();
const PORT = process.env.PORT || 5000;

// 1) JSON body parser
app.use(express.json());

// 2) Sağlık kontrol (en üstte koymak istersen burası olabilir)
app.get('/', (req, res) => res.send('🚀 API çalışıyor'));

// 3) Rotaları mount et
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/diary',   require('./routes/diary'));
app.use('/api/entries', require('./routes/entries'));
app.use('/api/upload',  require('./routes/upload'));
app.use('/api/schedules', require('./routes/schedules'));

// 4) MongoDB bağlantısı ve sonrasında scheduler + sunucu
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser:    true,
    useUnifiedTopology: true
  })
  .then(async () => {
    console.log('✅ MongoDB bağlandı');
    // etkin hatırlatmaları cron ile ayağa kaldır
    await initSchedulers();

    // HTTP sunucuyu başlat
    app.listen(PORT, () => {
      console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('❌ MongoDB bağlantı hatası:', err);
    process.exit(1);
  });
