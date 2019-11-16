const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const { pool } = require("../db/db");

router
  .route("/api/ravintolat")
  .get(controller.haeRavintolat)
  .post(controller.lisaaRavintola);

router.post("/api/ravintolapaivita", controller.muokkaaRavintola);

router.get("/api/listat", controller.haeListat);

router.get("/api/admin/salamoi", controller.salamoi);

module.exports = router;
