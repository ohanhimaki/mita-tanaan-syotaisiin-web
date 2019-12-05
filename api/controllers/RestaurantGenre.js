const { pool } = require("../db/db");

exports.readRestaurantGenre = (request, response) => {
  pool.query(
    `SELECT *
    FROM restaurantGenre;`,
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    }
  );
};

exports.createRestaurantGenre = (request, response) => {
  if (
    !request.header("apiKey") ||
    request.header("apiKey") !== process.env.API_KEY
  ) {
    return response.status(401).json({
      status: "error",
      message: "Unauthorized."
    });
  }

  const { genreName } = request.body;
  pool.query(
    `INSERT INTO restaurantGenre
    (GenreName) VALUES ($1);`,
    [genreName],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).json({
        status: "success",
        message: "restaurantGenre added"
      });
    }
  );
};
exports.updateRestaurantGenre = (request, response) => {
  if (
    !request.header("apiKey") ||
    request.header("apiKey") !== process.env.API_KEY
  ) {
    return response.status(401).json({
      status: "error",
      message: "Unauthorized."
    });
  }

  const { genreName, genreID } = request.body;
  pool.query(
    `UPDATE restaurantGenre
      SET GenreName = $1
    WHERE GenreID = $2;`,
    [genreName, genreID],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).json({
        status: "success",
        message: "restaurantGenre successfully updated"
      });
    }
  );
};

exports.deleteRestaurantGenre = (request, response) => {
  if (
    !request.header("apiKey") ||
    request.header("apiKey") !== process.env.API_KEY
  ) {
    return response.status(401).json({
      status: "error",
      message: "Unauthorized."
    });
  }

  const { genreName, genreID } = request.body;
  pool.query(
    `DELETE restaurantgenre
    WHERE GenreID = $1;`,
    [genreID],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).json({
        status: "success",
        message: "restaurantGenre successfully deleted"
      });
    }
  );
};
