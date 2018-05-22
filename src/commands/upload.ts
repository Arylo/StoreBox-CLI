import { Command } from './command';
import * as path from 'path';
import * as fs from 'fs';
import minimist = require('minimist');
import ora = require('ora');
import glob = require('glob');

type ARGV_TYPE = minimist.ParsedArgs & {
    glob: boolean
};

export = new class implements Command {

    usage = '$0 $command <file> [...files]';

    options: minimist.Opts = {
        boolean: ['glob'],
        default: {
            glob: false
        }
    };

    async handler(argv: ARGV_TYPE) {
        if (argv._.length === 0) {
            return;
        }
        const filepaths = [...new Set(argv._.map((item) => {
            if (path.isAbsolute(item)) {
                return item;
            }
            return `${process.cwd()}/${item}`;
        }).reduce((arr, item) => {
            if (argv.glob) {
                arr.push(...glob.sync(item));
            } else {
                arr.push(item);
            }
            return arr;
        }, [ ] as string[]).filter((item) => {
            return fs.existsSync(item) && fs.statSync(item).isFile;
        }))];
        if (filepaths.length === 0) {
            return console.log('NO FOUND FILES');
        }
        const client = require('../client');
        for (const filepath of filepaths) {
            const spinner = ora('Uploading');
            try {
                await client.uploadFile(filepath);
            } catch (error) {
                spinner.fail(`Upload Fail[${path.basename(filepath)}]`);
                continue;
            }
            spinner.succeed(`Upload Fail[${path.basename(filepath)}]`);
        }
    }

};