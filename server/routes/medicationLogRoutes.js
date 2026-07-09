const express = require('express');
const MedicationLog = require('../models/MedicationLog');
const buildCrudController = require('../controllers/genericController');
const { getToday, updateStatus } = require('../controllers/medicationLogController');

const router = express.Router();
const crud = buildCrudController(MedicationLog, { dateField: 'scheduledTime' });

// Custom routes first (must precede /:id to avoid "today" being parsed as an id)
router.get('/today', getToday);
router.put('/:id/status', updateStatus);

router.route('/')
  .get(crud.getAll)
  .post(crud.create);

router.route('/:id')
  .get(crud.getOne)
  .put(crud.update)
  .delete(crud.remove);

module.exports = router;
