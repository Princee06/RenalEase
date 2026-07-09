const asyncHandler = require('express-async-handler');
const User = require('../models/User');

// GET /api/users/me
const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});

// PUT /api/users/me
const updateMe = asyncHandler(async (req, res) => {
  // Prevent changing identity fields via this endpoint
  const { firebaseUid, email, ...updatableFields } = req.body;

  const updated = await User.findByIdAndUpdate(req.user._id, updatableFields, {
    new: true,
    runValidators: true,
  });

  res.json({ success: true, data: updated });
});

module.exports = { getMe, updateMe };
