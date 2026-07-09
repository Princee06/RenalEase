const DialysisSession = require('../models/DialysisSession');
const buildCrudController = require('../controllers/genericController');
const buildCrudRoutes = require('./genericRoutes');

const controller = buildCrudController(DialysisSession, { dateField: 'date' });
module.exports = buildCrudRoutes(controller);
