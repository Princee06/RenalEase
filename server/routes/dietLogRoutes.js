const DietLog = require('../models/DietLog');
const buildCrudController = require('../controllers/genericController');
const buildCrudRoutes = require('./genericRoutes');

const controller = buildCrudController(DietLog, { dateField: 'date' });
module.exports = buildCrudRoutes(controller);
