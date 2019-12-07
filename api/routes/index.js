const router = require("express").Router();

const restaurantgenre = require("./restaurantgenre");
const genreofrestaurant = require("./GenreOfRestaurantroute");
const restaurant = require("./restaurantroute");
const lunchlist = require("./lunchlistroute");
const lunchlisttodw = require("./lunchListsToDWRoute");
const handEditedLunchList = require("./handEditedLunchListRoute");
const generateLunchOfDay = require("./generateLunchOfDayRoute");
const lunchofday = require("./lunchOfDayRoute");

router.use(generateLunchOfDay);
router.use(handEditedLunchList);
router.use(restaurantgenre);
router.use(genreofrestaurant);
router.use(restaurant);
router.use(lunchlist);
router.use(lunchlisttodw);
router.use(lunchofday);

module.exports = router;
