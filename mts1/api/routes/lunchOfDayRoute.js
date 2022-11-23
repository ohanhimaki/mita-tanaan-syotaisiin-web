const express = require("express");
const lunchOfDayRoute = express.Router();
const lunchOfDay = require("../controllers/lunchOfDay");

lunchOfDayRoute.get("/api/lunchofday", lunchOfDay.getLunchOfDay);
lunchOfDayRoute.get("/api/lunchofdayhistory", lunchOfDay.getLunchOfDayHistory);

module.exports = lunchOfDayRoute;
