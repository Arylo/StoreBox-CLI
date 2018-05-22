import minimist = require('minimist');
import { Command } from './command';
import { read, save, SAVE_TYPE_OPTIONS, ACTION_TYPE_OPTIONS } from '../config';
import { client } from '../client';

type ARGV_TYPE = minimist.ParsedArgs & {
    type: SAVE_TYPE_OPTIONS
};

export = new class implements Command {

    usage = '$0 $command [--type local|global]';

    public options: minimist.Opts = {
        string: ["type"],
        default: {
            "type": SAVE_TYPE_OPTIONS.local
        }
    };

    handler(argv: ARGV_TYPE) {
        client.logout();
        const config = read();
        save(['username', 'token'], argv.type, ACTION_TYPE_OPTIONS.remove);
    }

};
