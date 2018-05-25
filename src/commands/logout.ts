import minimist = require('minimist');
import { URL } from 'url';
import { Command } from './command';
import { save, SAVE_TYPE_OPTIONS, ACTION_TYPE_OPTIONS } from '../config';
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
        if (argv.url) {
            client.setUrl(argv.url);
        }
        client.logout();
        const url = new URL(client.getUrl());
        const keys = [`${url.host}/:_authName`, `${url.host}/:_authToken`];
        save(keys, argv.type, ACTION_TYPE_OPTIONS.remove);
    }

};
