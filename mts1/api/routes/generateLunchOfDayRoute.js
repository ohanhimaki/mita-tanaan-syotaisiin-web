const express = require("express");
const generateLunchOfDayRouter = express.Router();
const generateLunchOfDay = require("../controllers/generateLunchOfDay");

generateLunchOfDayRouter.get(
  "/api/lunchofdayGen",
  generateLunchOfDay.generateLunchOfDay
);

module.exports = generateLunchOfDayRouter;
