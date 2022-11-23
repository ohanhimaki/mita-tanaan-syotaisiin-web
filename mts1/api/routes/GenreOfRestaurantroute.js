const express = require("express");
const RestaurantGenreRouter = express.Router();
const GenreOfRestaurant = require("../controllers/GenreOfRestaurant");

RestaurantGenreRouter.route("/api/genreofrestaurant")
  .get(GenreOfRestaurant.read)
  .post(GenreOfRestaurant.create)
  .delete(GenreOfRestaurant.delete);

module.exports = RestaurantGenreRouter;
