const asyncHandler = require('express-async-handler');

/**
 * Builds a standard set of CRUD handlers for a Mongoose model, scoped
 * to the authenticated user (req.user._id). All resources in RenalEase
 * are owned by exactly one user, so this covers ~90% of endpoints.
 *
 * @param {mongoose.Model} Model
 * @param {object} options
 * @param {string} [options.dateField] - field name to support ?from=&to= range filtering on
 */
function buildCrudController(Model, options = {}) {
  const { dateField } = options;

  // GET /api/resource  (supports ?from=&to= if dateField configured, plus pagination)
  const getAll = asyncHandler(async (req, res) => {
    const query = { user: req.user._id };

    if (dateField && (req.query.from || req.query.to)) {
      query[dateField] = {};
      if (req.query.from) query[dateField].$gte = new Date(req.query.from);
      if (req.query.to) query[dateField].$lte = new Date(req.query.to);
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = Math.min(parseInt(req.query.limit, 10) || 50, 200);
    const skip = (page - 1) * limit;

    const sortField = dateField || 'createdAt';

    const [items, total] = await Promise.all([
      Model.find(query).sort({ [sortField]: -1 }).skip(skip).limit(limit),
      Model.countDocuments(query),
    ]);

    res.json({
      success: true,
      count: items.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: items,
    });
  });

  // GET /api/resource/:id
  const getOne = asyncHandler(async (req, res) => {
    const item = await Model.findOne({ _id: req.params.id, user: req.user._id });
    if (!item) {
      res.status(404);
      throw new Error('Record not found');
    }
    res.json({ success: true, data: item });
  });

  // POST /api/resource
  const create = asyncHandler(async (req, res) => {
    const item = await Model.create({ ...req.body, user: req.user._id });
    res.status(201).json({ success: true, data: item });
  });

  // PUT /api/resource/:id
  const update = asyncHandler(async (req, res) => {
    const item = await Model.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { ...req.body, user: req.user._id },
      { new: true, runValidators: true }
    );
    if (!item) {
      res.status(404);
      throw new Error('Record not found');
    }
    res.json({ success: true, data: item });
  });

  // DELETE /api/resource/:id
  const remove = asyncHandler(async (req, res) => {
    const item = await Model.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!item) {
      res.status(404);
      throw new Error('Record not found');
    }
    res.json({ success: true, data: {} });
  });

  return { getAll, getOne, create, update, remove };
}

module.exports = buildCrudController;
