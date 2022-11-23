const express = require("express");
const RestaurantRouter = express.Router();
const Restaurant = require("../controllers/Restaurant");

RestaurantRouter.route("/api/ravintolat")
  .get(Restaurant.haeRavintolat)
  .post(Restaurant.lisaaRavintola)
  .put(Restaurant.muokkaaRavintola)
  .delete(Restaurant.poistaRavintola);

module.exports = RestaurantRouter;
