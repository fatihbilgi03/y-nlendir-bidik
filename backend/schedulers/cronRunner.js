// schedulers/cronRunner.js
const cron = require('node-cron');
const Schedule = require('../models/Schedule');
async function initSchedulers() {
  const jobs = await Schedule.find({ enabled: true });
  jobs.forEach(job => {
    cron.schedule(job.cron, async () => {
      job.lastFired = new Date();
      await job.save();
      // burada kullanıcıya bildirim göndermek veya günlük girişi oluşturmak gibi işlemler yapılabilir
      console.log(`Hatırlatma çalıştı: ${job.label}`);
    });
  });
}
module.exports = { initSchedulers };
