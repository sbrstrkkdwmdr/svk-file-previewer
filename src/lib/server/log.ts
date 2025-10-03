import * as fs from 'fs';
import moment from 'moment';
import * as util from 'util';

export function debugData(data: {
    time: string,
    [key: string]: any,
}, type: string, toconsole = true) {
    data.time = moment().format("YYYY-MM-DD HH:mm:ss.SSS");
    if (toconsole) {
        console.log(data);
    }
    if (!fs.existsSync('debug')) {
        fs.mkdirSync('debug');
    }
    if (!fs.existsSync('debug/' + type + '.txt')) {
        fs.writeFileSync('debug/' + type + '.txt', util.format(data) + '\n');
    } else {
        fs.appendFileSync('debug/' + type + '.txt', util.format(data) + '\n');
    }
}