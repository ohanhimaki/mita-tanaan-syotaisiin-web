const express = require("express");
const RestaurantRouter = express.Router();
const Restaurant = require("../controllers/Restaurant");

RestaurantRouter.route("/api/ravintolat")
  .get(Restaurant.haeRavintolat)
  .post(Restaurant.lisaaRavintola);

RestaurantRouter.post("/api/ravintolapaivita", Restaurant.muokkaaRavintola);
RestaurantRouter.post("/api/ravintolapoista", Restaurant.poistaRavintola);

module.exports = RestaurantRouter;
