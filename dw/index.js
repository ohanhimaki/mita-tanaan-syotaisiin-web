const dotenv = require("dotenv");
dotenv.config();
const {pool} = require("./config");
const https = require("https");
const cheerio = require("cheerio");
const format = require("pg-format");

const helpers = require("./helpers");

let thisWeekMonday = new Date(helpers.date.getPreviousMonday());
let ravintolat = [];
let rowsToInsert = [];
let responsesOfInsert = [];

exports.suoritaDatanLataus = async (request, response) => {
  ravintolat = await haeRavintolat();
  console.log('ravintolat', ravintolat.length)

  ravintolaData = [];
  ravintolat.forEach((ravintola, i) => {
    ravintolaData.push(haeDatat(ravintola, i));
  });
  rowsToFormat = [];
  ravintolaData.forEach(x => {
    rowsToFormat.push(haeDatat2(x));
  });
  rowsToFormat.forEach(x => {
    rowsToInsert.push(getDateData(x));
  });
  Promise.all(rowsToInsert).then(x => {
    responsesOfInsert.push(insertLunchLists(x));
    Promise.all(responsesOfInsert).then(x => {
      console.log("Ruokalistojen haku suoritettiin");
    });
  });
  response.status(200).json({
    status: "Success",
    message: "Salamointi suoritetttu"
  });
};
function haeRavintolat() {
  return new Promise((resolve, rej) => {
    try {
      pool.query(
        `SELECT distinct RavintolaID,
        apiid,
        Nimi
        FROM Ravintolat r
        left join lunchlist lu on lu.restaurantid = r.ravintolaid and date >= $1
        where tassalista = 1
        and lu.restaurantid is null;`,
        [helpers.date.formatDate(thisWeekMonday)],
        (err, res) => {
          if (err) throw err;
          let tmpArray = [];
          res.rows.forEach(ravintola => {
            tmpArray.push(ravintola);
          });
          resolve(tmpArray);
        }
      );
    } catch (error) {
      rej(error);
    }
  });
}

function haeDatat(ravintola, index) {
  return new Promise((resolve, reject) => {
    try {
      https.get(helpers.api.getApiUrl(ravintola.apiid), res => {
        let tmpdata = "";
        res.on("data", chunk => {
          tmpdata += chunk;
        });
        res.on("end", () => {
          if (tmpdata[0] != "<") {
            let tmp = JSON.parse(tmpdata);
            resolve({data: tmp, ravintola: ravintola});
          } else resolve();
        });
      });
    } catch (error) {
      reject(error);
    }
  });
}

async function haeDatat2(promise) {
  restaurantData = await promise;
  return new Promise((resolve, reject) => {
    try {
      tmpArray = [];
      if (restaurantData) {
        restaurantData.data.ads.forEach(row => {
          if (row.ad.contentType === 0) {
            tmpArray.push({
              body: row.ad.body,
              ravintola: restaurantData.ravintola
            });
          }
          resolve(tmpArray);
        });
      } else resolve();
    } catch (error) {
      reject(error);
    }
  });
}

async function getDateData(promise) {
  weekData = await promise;
  if (weekData) {
    weekData = weekData[0];
  } else return;
  return new Promise((resolve, reject) => {
    try {
      tmpArray = [];
      let $ = cheerio.load(weekData.body);
      let lunchDescs = $("div.lunchDesc");
      for (let i = 0; i < 7; i++) {
        let tmpDayRows = "";
        if (lunchDescs[i]) {
          childs = lunchDescs[i].children;
          for (var row in childs) {
            if (childs[row].type === "text") {
              tmpDayRows += childs[row].data + " <br>";
            }
            if (childs[row].type === "tag" && childs[row].name == "table") {
              let table = childs[row].children
              for (var row in table) {
                let rows = table[row].children
                for (var cell in rows) {
                  let rowText = "";
                  if (rows[cell].type === "tag" && rows[cell].name === "tr") {
                    let cells = rows[cell].children
                    for (var texts in cells) {
                      let cell1 = cells[texts];
                      // console.log('Tulee tänne', cell1 )
                      if (cell1.type === "tag" && cell1.name === "td") {
                        for (var child1 in cell1.children) {
                          rowText += cell1.children[child1].data;
                          // console.log(cell1.children[child1].data )
                        }
                      }
                    }
                  }
                  // console.log(rowText);
                  tmpDayRows += rowText + " <br>";
                }

              }

              tmpDayRows += childs[row].data + " <br>";
            }
          }
          tmpDayRows = tmpDayRows.substring(0, tmpDayRows.lastIndexOf(" <br>"));
          console.log(tmpDayRows);
        }
        if (tmpDayRows) {

          tmpArray.push({
            date: helpers.date.formatDate(
              helpers.date.addDays(thisWeekMonday, i)
            ),
            restaurantData: weekData.ravintola,
            dayData: tmpDayRows
          });
        }
      }
      resolve(tmpArray);
    } catch (error) {
      reject(error);
    }
  });
}

async function insertLunchLists(promise) {
  rows = await promise;
  return new Promise((resolve, reject) => {
    try {
      rowsFinalForm = [];
      if (rows) {
        rows.forEach(rowsOfRestaurant => {
          if (rowsOfRestaurant) {
            rowsOfRestaurant.forEach(dateLunchList => {
              rowsFinalForm.push(dateLunchList);
            });
          }
        });
      }
      nestedArray = [];

      rowsFinalForm.forEach(x => {
        nestedArray.push([x.date, x.restaurantData.ravintolaid, x.dayData]);
      });

      tehtyKysely = format(
        `INSERT INTO lunchlist (date,
                                restaurantid,
                                lunch)
        VALUES
        %L`,
        nestedArray
      );
      pool.query(tehtyKysely, (err, res) => {
        if (err) {
          console.log(err);
          resolve("done");
        } else {
          resolve("done");
        }
      });
    } catch (error) {
      reject(error);
    }
  });
}
