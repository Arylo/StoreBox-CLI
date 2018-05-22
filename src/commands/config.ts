import minimist = require('minimist');
import inquirer = require('inquirer');
import ora = require('ora');
import Table = require('cli-table');
import { Command } from './command';
import * as config from '../config';

type ARGV_TYPE = minimist.ParsedArgs & {
    type: config.SAVE_TYPE_OPTIONS
};

export = new class implements Command {

    usage = [
        'get',
        'list',
        'set <key> [val] [--type local|global]'
    ].map((item) => `$0 $command ${item}`).join('\n');

    public options: minimist.Opts = {
        string: ['type'],
        default: {
            'type': config.SAVE_TYPE_OPTIONS.local
        }
    }

    handler(argv: ARGV_TYPE) {
        const action = argv._[0] || '';
        switch(action) {
            case 'list': this.getter(argv); break;
            case 'get': this.getter(argv); break;
            case 'set': this.setter(argv); break;
            default: this.help(argv); break;
        }
    }

    private setter(argv: ARGV_TYPE) {
        if (argv._.length < 2 || !(argv.type in config.SAVE_TYPE_OPTIONS)) {
            return this.help(argv);
        }
        const [key, val] = [argv._[1], argv._[2]];
        if (!(['url'].find((item) => item === key))) {
            return this.help(argv);
        }
        if (val) {
            config.read();
            config.config[key] = val;
        }
        const spinner = ora('Setting').start();
        config.save(
            key as any, argv.type,
            config.ACTION_TYPE_OPTIONS[val ? 'update' : 'remove']
        );
        spinner.succeed('Set Success');
    }

    private getter(argv: ARGV_TYPE) {
        const table = new Table({
            chars: {
                'top-mid': '',
                'top-left': ' ',
                'top-right': ' ',
                'bottom-mid': '',
                'bottom-left': ' ',
                'bottom-right': ' ',
                'left': '',
                'left-mid': '',
                'mid': '',
                'mid-mid': '',
                'right': '',
                'right-mid': ''
            }
        });
        for (const key of Object.keys(config.read())) {
            const val = config.read()[key];
            table.push([key, val]);
        }
        console.log(table.toString());
    }

    public help(argv: minimist.ParsedArgs) {
        throw new Error();
    }
};
