import * as fs from 'fs';
import * as path from 'path';
import { Command } from './command';

export const DEF_COMMAND: Command = {
    handler: () => { },
    help: () => {
        throw new Error();
    }
};

const moduleObj = fs.readdirSync(__dirname)
    .filter((item) => {
        if (path.basename(__filename) === item) {
            return false;
        }
        return /\.[tj]s$/.test(item) && !/\.d\.ts$/.test(item);
    })
    .reduce((obj, filename) => {
        const m: Command = require(`${__dirname}/${filename}`);
        const command = m.command || filename.replace(/\.[tj]s$/, '')
        m.command = command;
        obj[command] = m;
        return obj;
    }, { } as { [c: string]: Command });

export const keys = Object.keys(moduleObj);

export const commands = keys.reduce((arr, key) => {
    arr.push(moduleObj[key]);
    return arr;
}, [ ] as Command[]);
