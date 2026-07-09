const mongoose = require('mongoose');

const dietLogSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    date: { type: Date, required: true },
    mealType: {
      type: String,
      enum: ['Breakfast', 'Lunch', 'Dinner', 'Snack'],
      required: true,
    },
    foodItem: { type: String, required: true, trim: true },
    potassiumMg: { type: Number, min: 0 },
    sodiumMg: { type: Number, min: 0 },
    phosphorusMg: { type: Number, min: 0 },
    proteinG: { type: Number, min: 0 },
    calories: { type: Number, min: 0 },
    notes: { type: String, trim: true },
  },
  { timestamps: true }
);

dietLogSchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('DietLog', dietLogSchema);
