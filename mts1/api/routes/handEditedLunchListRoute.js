const express = require("express");
const handEditedLunchListRouter = express.Router();
const handEditedLunchList = require("../controllers/handEditedLunchList");

handEditedLunchListRouter
  .route("/api/handedited")
  .get(handEditedLunchList.readHandEditedRow)
  .post(handEditedLunchList.createHandEditedRow);

module.exports = handEditedLunchListRouter;
