import minimist = require('minimist');
import { URL } from 'url';
import { Command } from './command';
import { read } from '../config';

export = new class implements Command {

    handler(argv: minimist.ParsedArgs) {
        const config = read();
        const url = new URL(config.url);
        const key = `${url.host}/:_authName`;
        if (config.url && config[key] && config[key].length > 0) {
            console.log(config[key]);
        } else {
            console.log('No User Logined');
        }
    }

};
