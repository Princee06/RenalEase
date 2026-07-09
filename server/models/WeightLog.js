const mongoose = require('mongoose');

const weightLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true },
    weightKg: { type: Number, required: true, min: 0 },
    note: { type: String, trim: true },
  },
  { timestamps: true }
);

weightLogSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('WeightLog', weightLogSchema);
