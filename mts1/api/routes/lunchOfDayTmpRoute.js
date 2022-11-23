const express = require("express");
const lunchOfDayTmpRouter = express.Router();
const lunchOfDayTmp = require("../controllers/lunchOfDayTmp");

lunchOfDayTmpRouter.route("/api/lunchofdaytmp").get(lunchOfDayTmp.read);

module.exports = lunchOfDayTmpRouter;
