const asyncHandler = require('express-async-handler');
const admin = require('../config/firebase');
const User = require('../models/User');

/**
 * Verifies the Firebase ID token sent in the Authorization header
 * ("Bearer <token>"), attaches the decoded token and the matching
 * local User document (creating one on first login) to req.
 */
const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || '';

  if (!authHeader.startsWith('Bearer ')) {
    res.status(401);
    throw new Error('Not authorized: missing bearer token');
  }

  const idToken = authHeader.split(' ')[1];

  let decodedToken;
  try {
    decodedToken = await admin.auth().verifyIdToken(idToken);
  } catch (err) {
    res.status(401);
    throw new Error('Not authorized: invalid or expired token');
  }

  req.firebaseUser = decodedToken;

  // Find or lazily create the local user profile linked by firebaseUid
  let user = await User.findOne({ firebaseUid: decodedToken.uid });
  if (!user) {
    user = await User.create({
      firebaseUid: decodedToken.uid,
      email: decodedToken.email || '',
      name: decodedToken.name || '',
    });
  }

  req.user = user;
  next();
});

module.exports = { protect };
