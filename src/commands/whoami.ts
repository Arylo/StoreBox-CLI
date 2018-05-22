import minimist = require('minimist');
import { Command } from './command';
import { read } from '../config';

export = new class implements Command {

    handler(argv: minimist.ParsedArgs) {
        const config = read();
        if (config.username && config.username.length > 0) {
            console.log(config.username);
        } else {
            console.log('No User Logined');
        }
    }

};
