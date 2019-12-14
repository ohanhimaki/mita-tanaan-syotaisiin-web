const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
var path = require("path");
const app = express();
const salamoi = require("../dw/");
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cors());

app.use(require("./routes"));

var distDir = process.cwd() + "/dist/";
app.use(express.static(distDir));

app.get("*", (request, response) => {
  response.sendFile(path.join(__dirname, "../dist/", "index.html"));
});
salamoi.suoritaDatanLataus();
// Start server
if (!module.parent) {
  app.listen(process.env.PORT || 3002, () => {
    console.log(`Server listening`);
  });
}

module.exports = app;
