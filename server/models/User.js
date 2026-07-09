const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firebaseUid: { type: String, required: true, unique: true, index: true },
    email: { type: String, trim: true, lowercase: true },
    name: { type: String, trim: true },
    dateOfBirth: { type: Date },
    ckdStage: {
      type: String,
      enum: [
        "Stage 1",
        "Stage 2",
        "Stage 3a",
        "Stage 3b",
        "Stage 4",
        "Stage 5",
        "Dialysis",
        "Transplant",
        "Unknown",
      ],
      default: "Unknown",
    },
    dialysisType: {
      type: String,
      enum: ["Hemodialysis", "Peritoneal Dialysis", "None"],
      default: "None",
    },
    dryWeightKg: { type: Number, min: 0 },
    phone: { type: String, trim: true },
    gender: { type: String, trim: true },
    address: { type: String, trim: true },
    allergies: { type: String, trim: true },
    doctorName: { type: String, trim: true },
    hospital: { type: String, trim: true },
    doctorPhone: { type: String, trim: true },
    emergencyContact: {
      name: { type: String, trim: true },
      phone: { type: String, trim: true },
      relationship: { type: String, trim: true },
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
