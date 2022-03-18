function DateConverter(serialDate) {
  var days = Math.floor(serialDate);
  var hours = Math.floor((serialDate % 1) * 24);
  var minutes = Math.floor((((serialDate % 1) * 24) - hours) * 60)
  return new Date(Date.UTC(0, 0, serialDate, hours-17, minutes));
}
 export default DateConverter