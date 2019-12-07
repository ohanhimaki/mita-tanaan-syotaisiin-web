const express = require("express");
const lunchlistRouter = express.Router();
const lunchlist = require("../controllers/lunchlist");

lunchlistRouter.get("/api/listat", lunchlist.haeListat);

module.exports = lunchlistRouter;
