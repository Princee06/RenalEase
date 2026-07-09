const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true }, // e.g. "Nephrologist Follow-up"
    doctorName: { type: String, trim: true },
    location: { type: String, trim: true },
    dateTime: { type: Date, required: true },
    durationMinutes: { type: Number, min: 0, default: 30 },
    type: {
      type: String,
      enum: ['Nephrologist', 'Dialysis', 'Lab Work', 'Dietitian', 'Surgery', 'Other'],
      default: 'Other',
    },
    status: {
      type: String,
      enum: ['scheduled', 'completed', 'cancelled', 'missed'],
      default: 'scheduled',
    },
    reminderMinutesBefore: { type: Number, default: 60 },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

appointmentSchema.index({ user: 1, dateTime: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
