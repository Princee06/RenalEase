const mongoose = require('mongoose');

const medicationSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true },
    dosage: { type: String, trim: true }, // e.g. "500mg"
    frequency: { type: String, trim: true }, // e.g. "Twice daily"
    times: [{ type: String, trim: true }], // e.g. ["08:00", "20:00"]
    withFood: { type: Boolean, default: false },
    prescribedBy: { type: String, trim: true },
    startDate: { type: Date },
    endDate: { type: Date },
    active: { type: Boolean, default: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Medication', medicationSchema);
