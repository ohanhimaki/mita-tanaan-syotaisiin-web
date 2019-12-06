const { pool } = require("../db/db");

exports.haeRavintolat = (request, response) => {
  pool.query("SELECT * FROM ravintolat;", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

exports.lisaaRavintola = (request, response) => {
  if (
    !request.header("apiKey") ||
    request.header("apiKey") !== process.env.API_KEY
  ) {
    return response.status(401).json({
      status: "error",
      message: "Unauthorized."
    });
  }

  const { ravintolaid, apiid, nimi, tassalista, linkki } = request.body;

  pool.query(
    "INSERT INTO ravintolat (apiid, nimi, tassalista, linkki) VALUES ($1, $2, $3, $4);",
    [apiid, nimi, tassalista, linkki],
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

exports.poistaRavintola = (request, response) => {
  if (
    !request.header("apiKey") ||
    request.header("apiKey") !== process.env.API_KEY
  ) {
    return response.status(401).json({
      status: "error",
      message: "Unauthorized."
    });
  }

  const { ravintolaid, apiid, nimi, tassalista, linkki } = request.body;

  pool.query(
    "DELETE FROM ravintolat WHERE ravintolaid = $1;",
    [ravintolaid],
    error => {
      if (error) {
        throw error;
      }
      response.status(201).json({
        status: "success",
        message: "Ravintola deleted."
      });
    }
  );
};

exports.muokkaaRavintola = (request, response) => {
  if (
    !request.header("apiKey") ||
    request.header("apiKey") !== process.env.API_KEY
  ) {
    return response.status(401).json({
      status: "error",
      message: "Unauthorized."
    });
  }

  const { ravintolaid, apiid, nimi, tassalista, linkki } = request.body;

  pool.query(
    `UPDATE ravintolat
    SET apiid = $1,
    nimi = $2,
    tassalista = $3,
    linkki = $4
    where ravintolaid = $5`,
    [apiid, nimi, tassalista, linkki, ravintolaid],
    error => {
      if (error) {
        throw error;
      }
      response.status(201).json({
        status: "success",
        message: "Ravintola edited."
      });
    }
  );
};
