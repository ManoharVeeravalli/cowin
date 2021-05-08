const axios = require('axios');
const chalk = require('chalk');
const moment = require('moment');
const nodemailer = require('nodemailer');
require('dotenv').config()
import {Center} from "./Center";

const player = require('play-sound')();

const {user, pass, clientId, clientSecret, refreshToken} = process.env;

let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        type: 'OAuth2',
        user,
        pass,
        clientId,
        clientSecret,
        refreshToken
    }
});


const log = console.log;
const blue_bold = chalk.blue.bold;

const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
}

setInterval(async function () {
    const now = moment();
    const today = now.format('DD-MM-YYYY');
    const tomorrow = now.add(1, 'days').format('DD-MM-YYYY');
    const API = `https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=596&date=${today}`;
    log(`${chalk.white.bold(`CHECKING FOR VACCINES: `)} ${chalk.white(`${today}`)}`);
    const {data}: { data: { centers: any[] } } = await axios.get(API, {headers});
    try {
        const centers: Center[] = data.centers.map(center => {
            const {name, block_name, district_name, state_name, address, pincode, fee_type, sessions} = center;
            return {
                name,
                address: `${address}, ${block_name}, ${district_name}, ${state_name}`,
                pin: pincode,
                fee_type,
                vaccines: sessions
            }
        });
        log(`${chalk.cyan.bold(`SUCCESS: NO OF CENTERS: ${centers.length}`)}`);
        centers.forEach(checkVaccineAvailability);
        statistics(centers, [today, tomorrow]);
    } catch ({message}) {
        log(`${chalk.red.bold(`FAILED: `)} ${chalk.red(message)}`);
    } finally {
        log(`\n`);
    }
}, 1000 * 60); //every 3 minutes

const statistics = (center: Center[], dates: string[]) => {
    dates.forEach(date => {
        const centersForToday = center.map(a => {
            const vaccine = a.vaccines.find(b => b.date === date);
            if (vaccine) {
                return vaccine.available_capacity > 0;
            }
            return false;
        });
        const noOfCentersWhereVaccineIsAvailableForTheDate = centersForToday.filter(a => a).length;
        log(`NO OF VACCINE AVAILABLE ON ${date}: ${chalk.whiteBright.bold(noOfCentersWhereVaccineIsAvailableForTheDate)}`)
    })
}

const playSound = () => {
    const audio = player.play('./media/build.mp3');
    setTimeout(() => {
        audio.kill()
    }, 20000);
}

const checkVaccineAvailability = ({name, vaccines, address, pin, fee_type}: Center, index: number): boolean => {
    vaccines.forEach(({vaccine: vaccine_name, available_capacity, min_age_limit, date}) => {
        if (available_capacity > 3) {
            let mailOptions = {
                from: 'muralimanohar707@gmail.com',
                to: 'muralimanohar707@gmail.com',
                subject: `ALERT: VACCINE AVAILABLE AT ${name}, ${pin}`,
                text: `
                ALERT: VACCINE AVAILABLE 
                CENTER NAME: ${name},
                TIME OF AVAILABILITY: ${moment().format('LLL')}
                VACCINE NAME: ${vaccine_name},
                DATE: ${(date)},
                AVAILABLE CAPACITY: ${available_capacity},
                AGE LIMIT: ${(min_age_limit)},
                ADDRESS: ${(address)},
                PIN CODE: ${(pin)},
                FEE TYPE: ${(fee_type)},`
            };
            transporter.sendMail(mailOptions);
            log(`
            ${chalk.cyan.bold(`${index + 1}) ${name}`)},
            ${chalk.blue.bold(`ALERT: VACCINE AVAILABLE`)} 
            VACCINE NAME: ${blue_bold(vaccine_name)},
            DATE: ${blue_bold(date)},
            AVAILABLE CAPACITY: ${available_capacity},
            AGE LIMIT: ${blue_bold(min_age_limit)},
            ADDRESS: ${blue_bold(address)},
            PIN CODE: ${blue_bold(pin)},
            FEE TYPE: ${blue_bold(fee_type)}`);
            playSound();
            return true;
        }
    })
    return false;
}


