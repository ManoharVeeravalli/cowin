var axios = require('axios');
var chalk = require('chalk');
var moment = require('moment');
var log = console.log;
var http = require('https');
// setInterval(function () {
var today = moment().format('DD/MM/YYYY');
var API = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=500047&&date=" + today;
log(chalk.white.bold("CALLING: ") + " " + chalk.white("COWIN at " + today));
axios.get(API)
    .then(function (response) {
    log("" + chalk.blue.bold("SUCCESS: "));
})["catch"](function (_a) {
    var message = _a.message;
    log(chalk.red.bold("FAILED: ") + " " + chalk.red(message));
});
http.get(API, function (r) {
    console.log(r);
});
// }, 1000 * 60 * 30);
