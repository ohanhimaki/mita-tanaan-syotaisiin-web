exports.dateintToDate = dateint => {
  if (!dateint) {
    return;
  }
  var datestring = dateint.toString();
  var year = datestring.substring(0, 4);
  var month = datestring.substring(4, 6);
  var day = datestring.substring(6, 8);

  return new Date(year, month - 1, day);
};
exports.getPreviousMonday = function () {
  var date = new Date();
  var day = date.getDay();
  var prevMonday;
  if (day === 0) {
    day = 7;
  }

  prevMonday = new Date().setDate(date.getDate() - day + 1);

  return prevMonday;
}

exports.dateToDateInt = function (date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return ([year, month, day].join(""));
}

exports.addDays = function (start, daysToAdd) {
  let date = new Date(start);
  date.setDate(date.getDate() + daysToAdd);

  return date;
}
