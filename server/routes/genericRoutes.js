const express = require('express');

/**
 * Wires up standard CRUD routes for a controller built by buildCrudController.
 * All routes are protected — the `protect` middleware must be applied
 * by the caller (done once in server.js via router-level middleware).
 */
function buildCrudRoutes(controller) {
  const router = express.Router();

  router.route('/')
    .get(controller.getAll)
    .post(controller.create);

  router.route('/:id')
    .get(controller.getOne)
    .put(controller.update)
    .delete(controller.remove);

  return router;
}

module.exports = buildCrudRoutes;
