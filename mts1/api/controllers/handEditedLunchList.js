const { pool } = require("../db/db");

exports.createHandEditedRow = (request, response) => {
  if (
    !request.header("apiKey") ||
    request.header("apiKey") !== process.env.API_KEY
  ) {
    return response.status(401).json({
      status: "error",
      message: "Unauthorized."
    });
  }

  const { ravintolaid, rivi, teksti } = request.body;

  pool.query(
    `DELETE FROM kasinpaivitetytlistat
    WHERE ravintolaID = $1`,
    [ravintolaid]
  );
  pool.query(
    `INSERT INTO kasinpaivitetytlistat (ravintolaid, rivi, teksti)
    VALUES ($1, $2, $3)
    `,
    [ravintolaid, rivi, teksti],
    error => {
      if (error) {
        throw error;
      }
      response.status(201).json({
        status: "success",
        message: "Create rows"
      });
    }
  );
};

exports.readHandEditedRow = (request, response) => {
  pool.query(
    "SELECT * FROM kasinpaivitetytlistat WHERE ravintolaid = $1 ORDER BY rivi;",
    [request.query.ravintolaid],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};
