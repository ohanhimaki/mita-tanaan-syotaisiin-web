const express = require("express");
const lunchlistToDwRouter = express.Router();
const lunchlisttodw = require("../controllers/lunchListsToDW");

lunchlistToDwRouter.get("/api/admin/salamoi", lunchlisttodw.salamoi);

module.exports = lunchlistToDwRouter;
