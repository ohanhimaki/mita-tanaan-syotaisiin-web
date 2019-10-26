const {
  pool
} = require('../db/db')
const dw = require("../../dw");

exports.haeRavintolat = (request, response) => {
  pool.query("SELECT * FROM ravintolat;", (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  });
};

exports.lisaaRavintola = (request, response) => {
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

exports.haeListat = (request, response) => {
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
    `SELECT r.*, ra.nimi FROM ruokalistat r left join ravintolat ra on r.apiid = ra.apiid where 
    (paiva = $1 OR 1 = $2) AND (r.apiid = $3  OR 1 = $4)`,
    [paiva, kaikkiPaivat, ravintolaid, kaikkiRavintolat],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

exports.salamoi = async (request, response) => {
  let apiresponse;
  if (
    !request.header("apiKey") ||
    request.header("apiKey") !== process.env.API_KEY
  ) {
    return response.status(401).json({
      status: "error",
      message: "Unauthorized."
    });
  }
  try {
    apiresponse = await dw.suoritaDatanLataus();

  } catch (e) {
    throw e;
  }

  return apiresponse;

}
