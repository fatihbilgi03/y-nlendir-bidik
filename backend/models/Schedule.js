// models/Schedule.js
const mongoose = require('mongoose');
const ScheduleSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  cron: { type: String, required: true },      // örn: "0 9 * * *" → her gün 09:00
  label: { type: String },
  enabled: { type: Boolean, default: true },
  lastFired: { type: Date }
});
module.exports = mongoose.model('Schedule', ScheduleSchema);
