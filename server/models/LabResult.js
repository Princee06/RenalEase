const mongoose = require('mongoose');

const labResultSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true },
    creatinine: { type: Number, min: 0 }, // mg/dL
    gfr: { type: Number, min: 0 }, // mL/min/1.73m2
    bun: { type: Number, min: 0 }, // Blood Urea Nitrogen mg/dL
    potassium: { type: Number, min: 0 }, // mEq/L
    sodium: { type: Number, min: 0 }, // mEq/L
    phosphorus: { type: Number, min: 0 }, // mg/dL
    calcium: { type: Number, min: 0 }, // mg/dL
    albumin: { type: Number, min: 0 }, // g/dL
    hemoglobin: { type: Number, min: 0 }, // g/dL
    pth: { type: Number, min: 0 }, // parathyroid hormone pg/mL
    labName: { type: String, trim: true },
    orderedBy: { type: String, trim: true },
    notes: { type: String, trim: true },
    attachmentUrl: { type: String, trim: true }, // link to uploaded PDF/report if stored elsewhere
  },
  { timestamps: true }
);

labResultSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('LabResult', labResultSchema);
