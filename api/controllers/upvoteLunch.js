const {formatDate} = require("../../dw/helpers/datehelpers");
const { pool } = require("../db/db");
exports.upvoteLunch = (request, response) => {

  const { restaurantid, date } = request.body;
  var dateint = formatDate(date);
  pool.query(
    `

    update lunchlist
    set votes = coalesce(votes,0)+1
    where restaurantid = $1 and date = $2;`,
    [restaurantid, dateint],
    (error, results) => {
      if (error) {
        throw error;
      }
      response.status(201).json({
        status: "success",
        message: "vote added"
      });
    }
  );
};
