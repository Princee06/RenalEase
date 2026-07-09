const mongoose = require('mongoose');

const dialysisSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    type: {
      type: String,
      enum: ['Hemodialysis', 'Peritoneal Dialysis'],
      required: true,
    },
    date: { type: Date, required: true },
    durationMinutes: { type: Number, required: true, min: 0 },
    preWeightKg: { type: Number, min: 0 },
    postWeightKg: { type: Number, min: 0 },
    fluidRemovedLiters: { type: Number, min: 0 },
    bloodPressurePre: { systolic: Number, diastolic: Number },
    bloodPressurePost: { systolic: Number, diastolic: Number },
    location: { type: String, trim: true }, // e.g. "Home" or clinic name
    complications: { type: String, trim: true },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

dialysisSessionSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('DialysisSession', dialysisSessionSchema);
