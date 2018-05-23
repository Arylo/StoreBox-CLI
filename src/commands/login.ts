import minimist = require('minimist');
import inquirer = require('inquirer');
import ora = require('ora');
import { Command } from './command';
import { SAVE_TYPE_OPTIONS } from '../config';
import { client } from '../client';
import * as config from '../config';
import { isString } from 'util';

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
    }

    public async handler(argv: ARGV_TYPE) {
        if (!(argv.type in SAVE_TYPE_OPTIONS)) {
            argv.type = SAVE_TYPE_OPTIONS.local;
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
        const spinner = ora('Logining').start();
        try {
            const req = await client
                .login(answers.username, answers.password);
            const obj = isString(req) ? JSON.parse(req): req;
            config.config.username = answers.username;
            config.config.token = obj.token;
            config.save(['username', 'token'], argv.type);
        } catch (error) {
            spinner.fail('Login Fail').stop();
            return;
        }
        spinner.succeed('Login Success');
    }
};
