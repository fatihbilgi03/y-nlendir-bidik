require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();

// 1) JSON body parser
app.use(express.json());

// 2) MongoDB bağlantısı
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('✅ MongoDB bağlandı'))
  .catch(err => console.error('❌ MongoDB bağlantı hatası:', err));

// 3) Rotaları mount et
app.use('/api/auth', require('./routes/auth'));
app.use('/api/diary', require('./routes/diary'));

// 4) Sağlık kontrol
app.get('/', (req, res) => res.send('🚀 API çalışıyor'));

// 5) Sunucuyu ayağa kaldır
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Sunucu çalışıyor: http://localhost:${PORT}`));
