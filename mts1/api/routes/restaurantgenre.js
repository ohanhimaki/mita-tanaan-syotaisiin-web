const express = require("express");
const RestaurantGenreRouter = express.Router();
const RestaurantGenre = require("../controllers/RestaurantGenre");

RestaurantGenreRouter.route("/api/restaurantgenre")
  .get(RestaurantGenre.readRestaurantGenre)
  .post(RestaurantGenre.createRestaurantGenre)
  .put(RestaurantGenre.updateRestaurantGenre)
  .delete(RestaurantGenre.deleteRestaurantGenre);

module.exports = RestaurantGenreRouter;
