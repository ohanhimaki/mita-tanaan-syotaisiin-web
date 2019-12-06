const express = require("express");
const router = express.Router();
const controller = require("../controllers");
const { pool } = require("../db/db");
const restaurantgenre = require("./restaurantgenre");
const genreofrestaurant = require("./GenreOfRestaurantroute");
router
  .route("/api/ravintolat")
  .get(controller.haeRavintolat)
  .post(controller.lisaaRavintola);

router.post("/api/ravintolapaivita", controller.muokkaaRavintola);
router.post("/api/ravintolapoista", controller.poistaRavintola);

router.route("/api/handedited").get(controller.readHandEditedRow);
router.route("/api/handedited").post(controller.createHandEditedRow);

router.get("/api/listat", controller.haeListat);

router.get("/api/admin/salamoi", controller.salamoi);
router.get("/api/lunchofdayGen", controller.generateLunchOfDay);

router.get("/api/lunchofday", controller.getLunchOfDay);
router.get("/api/lunchofdayhistory", controller.getLunchOfDayHistory);

router.use(restaurantgenre);
router.use(genreofrestaurant);

module.exports = router;
