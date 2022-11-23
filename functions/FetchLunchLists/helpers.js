const dotenv = require("dotenv");
dotenv.config();
const https = require("https");
const cheerio = require("cheerio");

const helpers = require("../../Scripts/helpers");

let thisWeekMonday = new Date(helpers.date.getPreviousMonday());
let ravintolat = [];
let rowsToInsert = [];
let responsesOfInsert = [];




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
          // console.log(tmpDayRows);
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

module.exports = { haeDatat, haeDatat2, getDateData };
