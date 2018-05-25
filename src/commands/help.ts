import path = require('path');
import minimist = require('minimist');
import Table = require('cli-table');
import { Command } from './command';
import { keys, commands, DEF_COMMAND } from './index';
import { getCommand, argv } from '../router';
import * as utils from '../utils';

export = new class implements Command {

    usage = [
        '[command]'
    ].map((item) => `$0 $command ${item}`).join('\n');

    handler(argv: minimist.ParsedArgs) {
        const command = argv._[0];
        if (keys
            .filter((key) => key !== 'help' )
            .find((key) => key === command)
        ) {
            const fn = getCommand(command).help || DEF_COMMAND.help;
            try {
                fn(argv);
            } catch (error) {
                return this.commandHelp(argv, command);
            }
            return;
        }
        this.help(argv);
    }

    help(argv: minimist.ParsedArgs) {
        this.commandHelp(argv);
    }

    private commandHelp(argv: minimist.ParsedArgs, command?: string) {
        const $0 = path.basename(process.argv[1]);
        if (!command) {
            console.log(`\nUsage: ${$0} <command> [-v|-h]`);
            console.log('\ncommand:')
            const table = new Table({
                chars: utils.recode([
                    'top', 'top-mid', 'top-left', 'top-right',
                    'bottom', 'bottom-mid', 'bottom-left', 'bottom-right',
                    'left', 'left-mid', 'right',, 'right-mid',
                    'mid', 'mid-mid', 'middle'
                ], '')
            });
            keys.forEach((key) => table.push([
                key,
                (getCommand(key).usage || `$0 $command`)
                    .replace(/\$0/g, $0)
                    .replace(/\$command/g, key)
            ]));
            console.log(table.toString());
        } else {
            console.log('\nUsage:\n');
            console.log((getCommand(command).usage || `$0 $command`)
                .replace(/\$0/g, $0)
                .replace(/\$command/g, command));
        }

    }
}
