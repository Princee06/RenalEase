const mongoose = require('mongoose');

const medicationLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    medication: { type: mongoose.Schema.Types.ObjectId, ref: 'Medication', required: true, index: true },
    scheduledTime: { type: Date, required: true },
    takenAt: { type: Date },
    status: {
      type: String,
      enum: ['pending', 'taken', 'missed', 'skipped'],
      default: 'pending',
    },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

medicationLogSchema.index({ user: 1, scheduledTime: -1 });

module.exports = mongoose.model('MedicationLog', medicationLogSchema);
