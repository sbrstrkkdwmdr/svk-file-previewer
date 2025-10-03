import { arrayToDict } from '$lib/tools';
import * as Sequelize from 'sequelize';
import { debugData } from './log';

export const database = new Sequelize.Sequelize('database', 'username', 'password', {
    host: 'localhost',
    dialect: 'sqlite',
    logging: msg => debugData({
        time: '',
        msg
    }, 'database', false),
    storage: 'database.sqlite',
    benchmark: true,
});

export const fileData = database.define('fileDownloads', {
    file: {
        type: Sequelize.STRING,
        unique: true,
        primaryKey: true
    },
    count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
});

export const counters = database.define('counters', {
    name: {
        type: Sequelize.STRING,
        unique: true,
        primaryKey: true
    },
    count: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    }
});

export function setupDb() {
    fileData.sync();
    counters.sync();
}

export async function downloadUpdate(location: string, name: string, tries = 0) {
    let input =
        location +
        (location.endsWith('/') ? '' : '/')
        + name;
    let findFile = await fileData.findOne({ where: { file: input } }).catch(err => {
        debugData({
            time: '',
            message: 'Error fetching file',
            err
        }, 'errors');
    });;
    if (!findFile) {
        await fileData.create({
            file: input,
            count: 1
        }).catch(err => {
            debugData({
                time: '',
                message: 'Error creating file counter for ' + input,
                err
            }, 'errors');
            if (tries < 2) {
                setTimeout(() => {
                    downloadUpdate(location, name, tries + 1);
                }, 500);
            }
        });
    } else {
        await findFile.update({
            count: findFile.getDataValue('count') + 1
        }).catch(err => {
            debugData({
                time: '',
                message: 'Error updating file counter for ' + input,
                err
            }, 'errors');
        });
    }
}

export function checkForInject(str: string) {
    str = str.toLowerCase();
    if (str.includes(';')) return true;
    if (str.includes('drop table')) return true;
    if (str.includes('select * from')) return true;
    if (str.includes('exec')) return true;
    if (str.includes('1\'=\'1')) return true;
    return false;
}

export async function downloadGet(location: string, name: string) {
    let input =
        location +
        (location.endsWith('/') ? '' : '/')
        + name;
    let findFile = await fileData.findOne({ where: { file: input } }).catch(err => {
        debugData({
            time: '',
            message: 'Error fetching file',
            err
        }, 'errors');
    });;
    if (findFile) {
        return +findFile.getDataValue("count");
    }
    return +0;
}