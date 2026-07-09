const mongoose = require('mongoose');

const fluidIntakeSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true },
    amountMl: { type: Number, required: true, min: 0 },
    beverageType: { type: String, trim: true }, // e.g. "Water", "Tea", "Juice"
    note: { type: String, trim: true },
  },
  { timestamps: true }
);

fluidIntakeSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('FluidIntake', fluidIntakeSchema);
