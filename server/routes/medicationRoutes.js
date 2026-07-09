const Medication = require('../models/Medication');
const buildCrudController = require('../controllers/genericController');
const buildCrudRoutes = require('./genericRoutes');

const controller = buildCrudController(Medication);
module.exports = buildCrudRoutes(controller);
