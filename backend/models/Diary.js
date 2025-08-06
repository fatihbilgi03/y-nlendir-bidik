const mongoose = require('mongoose');
const { Schema } = mongoose;

const DiarySchema = new Schema({
  user:  { type: Schema.Types.ObjectId, ref: 'User', required: true },
  text:  { type: String },
  audio: { type: String }   // kaydedilen dosyanın yolu, örn: "/uploads/abc.mp3"
}, { timestamps: { createdAt: 'date', updatedAt: 'updated' } });

module.exports = mongoose.model('Diary', DiarySchema);
