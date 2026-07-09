const FluidIntake = require('../models/FluidIntake');
const buildCrudController = require('../controllers/genericController');
const buildCrudRoutes = require('./genericRoutes');

const controller = buildCrudController(FluidIntake, { dateField: 'date' });
module.exports = buildCrudRoutes(controller);
