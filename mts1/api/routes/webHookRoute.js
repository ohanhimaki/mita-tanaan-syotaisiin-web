const express = require("express");
const lunchOfDayRoute = express.Router();
const webHookDayStatuses = require("../controllers/WebHooksDayStatus");

lunchOfDayRoute.get("/api/WebHooksDayStatus", webHookDayStatuses.sendDayStatuses);
// lunchOfDayRoute.get("/api/lunchofdayhistory", lunchOfDay.getLunchOfDayHistory);

module.exports = lunchOfDayRoute;
