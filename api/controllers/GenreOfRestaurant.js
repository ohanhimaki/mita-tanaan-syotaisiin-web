const { pool } = require("../db/db");

exports.read = (request, response) => {
  let restaurantid = request.query.restaurantid;

  pool.query(
    `SELECT gg.genrename, g.genreid, g.restaurantid
from genreofrestaurant g
left join restaurantgenre gg on g.genreid = gg.genreid
    WHERE restaurantid = $1;`,
    [restaurantid],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

exports.create = (request, response) => {
  if (
    !request.header("apiKey") ||
    request.header("apiKey") !== process.env.API_KEY
  ) {
    return response.status(401).json({
      status: "error",
      message: "Unauthorized."
    });
  }

  const { genreid, restaurantid } = request.body;
  pool.query(
    `INSERT INTO genreofrestaurant
    (Genreid, restaurantid) VALUES ($1, $2);`,
    [genreid, restaurantid],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).json({
        status: "success",
        message: "genreofrestaurant added"
      });
    }
  );
};

exports.delete = (request, response) => {
  if (
    !request.header("apiKey") ||
    request.header("apiKey") !== process.env.API_KEY
  ) {
    return response.status(401).json({
      status: "error",
      message: "Unauthorized."
    });
  }

  const { genreid, restaurantid } = request.body;
  pool.query(
    `DELETE FROM genreofrestaurant
    WHERE genreid =$1
    AND restaurantid =$2;`,
    [genreid, restaurantid],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).json({
        status: "success",
        message: "genreofrestaurant deleted"
      });
    }
  );
};
