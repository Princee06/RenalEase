const Appointment = require('../models/Appointment');
const buildCrudController = require('../controllers/genericController');
const buildCrudRoutes = require('./genericRoutes');

const controller = buildCrudController(Appointment, { dateField: 'dateTime' });
module.exports = buildCrudRoutes(controller);
