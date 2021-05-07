const axios = require('axios');
const chalk = require('chalk');
const moment = require('moment');
const log = console.log;


setInterval(function () {
    const today = moment().format('DD/MM/YYYY');
    const API = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByPin?pincode=500047&&date=${today}`;
    log(`${chalk.white.bold(`CALLING: `)} ${chalk.white(`COWIN at ${today}`)}`);
    axios.get(API)
        .then((response: any) => {
            log(`${chalk.blue.bold(`SUCCESS: `)}`);
        })
        .catch(({message}: any) => {
            log(`${chalk.red.bold(`FAILED: `)} ${chalk.red(message)}`);
        });
}, 1000 * 60 * 30);


