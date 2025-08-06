// routes/schedules.js
const express = require('express');
const router  = express.Router();
const verify  = require('../middleware/auth');
const Schedule = require('../models/Schedule');

// Create a new schedule
router.post('/', verify, async (req, res) => {
  const { label, cron } = req.body;
  const sched = new Schedule({ userId: req.user.id, label, cron });
  await sched.save();
  res.status(201).json(sched);
});

// List schedules
router.get('/', verify, async (req, res) => {
  const list = await Schedule.find({ userId: req.user.id });
  res.json(list);
});

// Enable/disable or update
router.put('/:id', verify, async (req, res) => {
  const { enabled, cron, label } = req.body;
  const upd = await Schedule.findOneAndUpdate(
    { _id: req.params.id, userId: req.user.id },
    { enabled, cron, label },
    { new: true }
  );
  res.json(upd);
});

// Delete
router.delete('/:id', verify, async (req, res) => {
  await Schedule.deleteOne({ _id: req.params.id, userId: req.user.id });
  res.status(204).end();
});

module.exports = router;
