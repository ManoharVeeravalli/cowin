"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var axios = require('axios');
var chalk = require('chalk');
var moment = require('moment');
var log = console.log;
var blue_bold = chalk.blue.bold;
var headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'
};
setInterval(function () {
    return __awaiter(this, void 0, void 0, function () {
        var now, today, tomorrow, API, data, centers, message;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    now = moment();
                    today = now.format('DD-MM-YYYY');
                    tomorrow = now.add(1, 'days').format('DD-MM-YYYY');
                    API = "https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/calendarByDistrict?district_id=597&date=" + today;
                    log(chalk.white.bold("CHECKING FOR VACCINES: ") + " " + chalk.white("" + today));
                    return [4 /*yield*/, axios.get(API, { headers: headers })];
                case 1:
                    data = (_a.sent()).data;
                    try {
                        centers = data.centers.map(function (center) {
                            var name = center.name, block_name = center.block_name, district_name = center.district_name, state_name = center.state_name, address = center.address, pincode = center.pincode, fee_type = center.fee_type, sessions = center.sessions;
                            return {
                                name: name,
                                address: address + ", " + block_name + ", " + district_name + ", " + state_name,
                                pin: pincode,
                                fee_type: fee_type,
                                vaccines: sessions
                            };
                        });
                        log("" + chalk.cyan.bold("SUCCESS: NO OF CENTERS: " + centers.length));
                        centers.forEach(checkVaccineAvailability);
                        statistics(centers, [today, tomorrow]);
                    }
                    catch (_b) {
                        message = _b.message;
                        log(chalk.red.bold("FAILED: ") + " " + chalk.red(message));
                    }
                    finally {
                        log("\n");
                    }
                    return [2 /*return*/];
            }
        });
    });
}, 5000);
var statistics = function (center, dates) {
    dates.forEach(function (date) {
        var centersForToday = center.map(function (a) {
            var vaccine = a.vaccines.find(function (b) { return b.date === date; });
            if (vaccine) {
                return vaccine.available_capacity > 0;
            }
            return false;
        });
        var noOfCentersWhereVaccineIsAvailableForTheDate = centersForToday.filter(function (a) { return a; }).length;
        log("NO OF VACCINE AVAILABLE ON " + date + ": " + chalk.whiteBright.bold(noOfCentersWhereVaccineIsAvailableForTheDate));
    });
};
var checkVaccineAvailability = function (_a, index) {
    var name = _a.name, vaccines = _a.vaccines, address = _a.address, pin = _a.pin, fee_type = _a.fee_type;
    vaccines.forEach(function (_a) {
        var vaccine_name = _a.vaccine, available_capacity = _a.available_capacity, min_age_limit = _a.min_age_limit, date = _a.date;
        if (available_capacity > 0) {
            log("\n            " + chalk.cyan.bold(index + 1 + ") " + name) + ",\n            " + chalk.blue.bold("ALERT: VACCINE AVAILABLE") + " \n            VACCINE NAME: " + blue_bold(vaccine_name) + ",\n            DATE: " + blue_bold(date) + "\n            AGE LIMIT: " + blue_bold(min_age_limit) + ",\n            ADDRESS: " + blue_bold(address) + ",\n            PIN CODE: " + blue_bold(pin) + ",\n            FEE TYPE: " + blue_bold(fee_type));
            return true;
        }
    });
    return false;
};
