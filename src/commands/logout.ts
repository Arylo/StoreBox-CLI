import minimist = require('minimist');
import { URL } from 'url';
import { Command } from './command';
import { read, save, SAVE_TYPE_OPTIONS, ACTION_TYPE_OPTIONS } from '../config';
import { client } from '../client';

type ARGV_TYPE = minimist.ParsedArgs & {
    type: SAVE_TYPE_OPTIONS;
    url?: string;
};

export = new class implements Command {

    usage = '$0 $command [--type local|global] [--url url]';

    public options: minimist.Opts = {
        string: ["type", "url"],
        default: {
            "type": SAVE_TYPE_OPTIONS.local
        }
    };

    handler(argv: ARGV_TYPE) {
        client.setUrl(argv.url);
        client.logout();
        const config = read();
        const url = new URL(config.url);
        const keys = [`${url.host}/:_authName`, `${url.host}/:_authToken`];
        save(keys, argv.type, ACTION_TYPE_OPTIONS.remove);
    }

};
