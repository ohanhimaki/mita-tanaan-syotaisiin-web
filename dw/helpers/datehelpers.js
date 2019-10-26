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

exports.formatDate = function (date) {
  var d = new Date(date),
    month = "" + (d.getMonth() + 1),
    day = "" + d.getDate(),
    year = d.getFullYear();

  if (month.length < 2) month = "0" + month;
  if (day.length < 2) day = "0" + day;

  return [year, month, day].join("");
}

exports.addDays = function (start, daysToAdd) {
  let date = new Date(start);
  date.setDate(date.getDate() + daysToAdd);

  return date;
}
