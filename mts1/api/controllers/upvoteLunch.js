const {formatDate} = require("../../dw/helpers/datehelpers");
const { pool } = require("../db/db");
exports.upvoteLunch = (request, response) => {

  const { restaurantid, date } = request.body;
  var dateint = formatDate(date);
  pool.query(
      `
    SELECT coalesce(sum(tassalista), 0) as sum
    from ravintolat
    where ravintolaid = $1
    `,
      [restaurantid],
      (error,result) => {

        if (result.rows[0].sum == 1) {
          pool.query(
            `
        update lunchlist
        set votes = coalesce(votes,0)+1
        where restaurantid = $1 and date = $2;
    `,
            [restaurantid, dateint]
          );

        } else {
            pool.query(
              `
            SELECT count(*) as sum from lunchlistvotes
            where restaurantid = $1 and dateid = $2
      `,
              [restaurantid, dateint]
              ,(error,result2) => {
                if (result2.rows[0].sum == 0) {
                  pool.query(
                    `
              insert into lunchlistvotes (restaurantid, dateid, votes) values ($1,$2,1);
            `,
                    [restaurantid, dateint]
                  );
                } else {

                  pool.query(
                    `
            update lunchlistvotes SET votes = votes+1
            WHERE restaurantid = $1 and dateid = $2;
          `,
                    [restaurantid, dateint],(error, result) => {
                      if (error) {
                        throw error;
                      }
                    }
                  );
                }

              }
            );

        }
      }
      );
  response.status(201).json({
    status: "success",
    message: "vote added"
  })
};
