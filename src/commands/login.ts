import minimist = require('minimist');
import inquirer = require('inquirer');
import ora = require('ora');
import { isString } from 'util';
import { Command } from './command';
import { client } from '../client';
import * as config from '../config';

type ARGV_TYPE = minimist.ParsedArgs & {
    type: config.SAVE_TYPE_OPTIONS;
    url?: string;
};

export = new class implements Command {

    usage = '$0 $command [--type local|global] [--url url]';

    public options: minimist.Opts = {
        string: ["type", "url"],
        default: {
            "type": config.SAVE_TYPE_OPTIONS.local
        }
    }

    public async handler(argv: ARGV_TYPE) {
        if (!(argv.type in config.SAVE_TYPE_OPTIONS)) {
            argv.type = config.SAVE_TYPE_OPTIONS.local;
        }
        const answers: any = await inquirer.prompt([{
            type: 'input',
            name: 'username',
            message: 'Type your username'
        }, {
            type: 'password',
            name: 'password',
            message: 'Type the password'
        }]);
        if (argv.url) {
            client.setUrl(argv.url);
        }
        const url = new URL(config.read().url);
        const keys = [`${url.host}/:_authName`, `${url.host}/:_authToken`];
        const spinner = ora('Logining').start();
        try {
            const req = await client
                .login(answers.username, answers.password);
            const obj = isString(req) ? JSON.parse(req): req;
            config.config[keys[0]] = answers.username;
            config.config[keys[1]] = obj.token;
            config.save(keys, argv.type);
        } catch (error) {
            spinner.fail('Login Fail').stop();
            return;
        }
        spinner.succeed('Login Success');
    }
};
