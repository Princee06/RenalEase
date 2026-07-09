const asyncHandler = require('express-async-handler');
const MedicationLog = require('../models/MedicationLog');

// GET /api/medication-logs/today - all scheduled doses for today
const getToday = asyncHandler(async (req, res) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const end = new Date();
  end.setHours(23, 59, 59, 999);

  const logs = await MedicationLog.find({
    user: req.user._id,
    scheduledTime: { $gte: start, $lte: end },
  })
    .populate('medication', 'name dosage withFood')
    .sort({ scheduledTime: 1 });

  res.json({ success: true, count: logs.length, data: logs });
});

// PUT /api/medication-logs/:id/status - mark a dose taken/missed/skipped
const updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['taken', 'missed', 'skipped', 'pending'].includes(status)) {
    res.status(400);
    throw new Error('Invalid status value');
  }

  const log = await MedicationLog.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { status, takenAt: status === 'taken' ? new Date() : undefined },
    { new: true }
  );

  if (!log) {
    res.status(404);
    throw new Error('Medication log not found');
  }

  res.json({ success: true, data: log });
});

module.exports = { getToday, updateStatus };
