exports.dateintToDate = dateint => {
  if (!dateint) {
    return;
  }
  var datestring = dateint.toString();
  var year = datestring.substring(0, 4);
  var month = datestring.substring(4, 6);
  var day = datestring.substring(6, 8);

  var date = new Date(year, month - 1, day);
  return date;
};
