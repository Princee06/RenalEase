const express = require('express');
const { getMe, updateMe } = require('../controllers/userController');

const router = express.Router();

router.route('/me')
  .get(getMe)
  .put(updateMe);

module.exports = router;
