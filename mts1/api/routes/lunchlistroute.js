const express = require("express");
const lunchlistRouter = express.Router();
const lunchlist = require("../controllers/lunchlist");
const upvoteLunch = require("../controllers/upvoteLunch");

lunchlistRouter.get("/api/listat", lunchlist.haeListat);
lunchlistRouter.put("/api/upvotelunch", upvoteLunch.upvoteLunch);

module.exports = lunchlistRouter;
