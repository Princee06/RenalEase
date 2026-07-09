const WeightLog = require('../models/WeightLog');
const buildCrudController = require('../controllers/genericController');
const buildCrudRoutes = require('./genericRoutes');

const controller = buildCrudController(WeightLog, { dateField: 'date' });
module.exports = buildCrudRoutes(controller);
