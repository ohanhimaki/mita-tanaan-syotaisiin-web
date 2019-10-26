const express = require('express');
const router = express.Router();
const controller = require('../controllers')
const {
  pool
} = require('../db/db')

router
  .route("/api/ravintolat")
  // GET endpoint
  .get(controller.haeRavintolat)
  // POST endpoint
  .post(controller.lisaaRavintola);

router.get("/api/listat", controller.haeListat);

router.get("/api/admin/salamoi", controller.salamoi);

module.exports = router
