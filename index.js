const dotenv = require("dotenv");
dotenv.config();
const {
  pool
} = require("./config");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const dw = require("./dw/");

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(cors());

var distDir = __dirname + "/dist/";
app.use(express.static(distDir));

const haeRavintolat = (request, response) => {
  pool.query("SELECT * FROM ravintolat;", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

const lisaaRavintola = (request, response) => {
  const {
    apiid,
    nimi
  } = request.body;

  pool.query(
    "INSERT INTO ravintolat (apiid, nimi) VALUES ($1, $2);",
    [apiid, nimi],
    error => {
      if (error) {
        throw error;
      }
      response.status(201).json({
        status: "success",
        message: "Ravintola added."
      });
    }
  );
};

const haeListat = (request, response) => {
  var paiva = request.params.paiva;

  pool.query(
    "SELECT * FROM ruokalistat where paiva = $1",
    [paiva],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

app
  .route("/api/ravintolat")
  // GET endpoint
  .get(haeRavintolat)
  // POST endpoint
  .post(lisaaRavintola);

app.get("/api/listat", (request, response) => {
  let kaikkiPaivat = 0;
  let kaikkiRavintolat = 0;

  let paiva = 0;
  if (!request.query.paiva) {
    paiva = 0;
    kaikkiPaivat = 1;
  } else {
    paiva = request.query.paiva;
  }
  if (!request.query.ravintolaid) {
    ravintolaid = 0;
    kaikkiRavintolat = 1;
  } else {
    ravintolaid = request.query.ravintolaid;
  }

  pool.query(
    `SELECT r.*, ra.nimi FROM ruokalistat r left join ravintolat ra on r.ravintolaid = ra.apiid where 
    (paiva = $1 OR 1 = $2) AND (r.ravintolaid = $3  OR 1 = $4)`,
    [paiva, kaikkiPaivat, ravintolaid, kaikkiRavintolat],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
});

app.get("/api/admin/salamoi", async (request, response) => {
  if (
    !request.header("apiKey") ||
    request.header("apiKey") !== process.env.API_KEY
  ) {
    return response.status(401).json({
      status: "error",
      message: "Unauthorized."
    });
  }

  await dw.suoritaDatanLataus();

  response.status(200).json(results.rows);
});

app.get("*", (request, response) => {
  response.sendFile(path.join(__dirname, "/dist/", "index.html"));
});

// Start server
app.listen(process.env.PORT || 4200, () => {
  console.log(`Server listening`);
});
