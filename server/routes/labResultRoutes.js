const LabResult = require('../models/LabResult');
const buildCrudController = require('../controllers/genericController');
const buildCrudRoutes = require('./genericRoutes');

const controller = buildCrudController(LabResult, { dateField: 'date' });
module.exports = buildCrudRoutes(controller);
