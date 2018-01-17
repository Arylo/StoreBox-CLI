import minimist = require("minimist");
import ini = require("ini");
import inquirer = require("inquirer");
import validator = require("validator");

import config = require("../helpers/config");
import { showHelp } from './help';
import { ConfigType } from '../helpers/config';

const argv = minimist(process.argv.slice(2), {
    boolean: ["global"],
    alias: { g: "global" }
});

export const usage = "Usage: $0 config <get|set>";

export const describe = "PandoraBox Uploader Config";

export const alias = "c";

export const handler = () => {
    switch(argv._[1]) {
        case "get": showConfig(); break;
        case "set": setConfig(); break;
        default: showHelp();
    }
};

const showConfig = () => {
    const obj = config.get();
    for (const key in obj) {
        let value = obj[key];
        if (key === "token" && value && value.length > 4) {
            value = `****${value.substr(-4)}`;
        }
        console.log(key, "=", value);
    }
};

const setConfig = () => {
    const EXIT_TEXT = "[EXIT]";
    const setPrompt = () => {
        return inquirer.prompt([{
            type: "list",
            name: "type",
            message: `Choose one item to set, or select ${EXIT_TEXT}`,
            choices: [
                ...Object.keys(config.get()).filter((item) => {
                    // 用户名及Token 在Login/Logout 设置
                    return !~["username", "token"].indexOf(item);
                }),
                new inquirer.Separator(),
                EXIT_TEXT
            ]
        }]).then((answers) => {
            if (answers.type === EXIT_TEXT) {
                process.exit(0);
            }
            const quesion = {
                type: "input",
                name: "value",
                message: `Please type \`${answers.type}\` value:`,
                validate: (v: any): boolean | string => true
            };
            if (/url/.test(answers.type)) {
                quesion.validate = (value) => {
                    const b = validator.isURL(value);
                    if (b) {
                        return b;
                    } else {
                        return "The isnt URL";
                    }
                };
            }
            return inquirer.prompt([ quesion ]).then(({value: value}) => {
                const mode = argv.g ? ConfigType.GLOBAL: ConfigType.USER;
                config.set(mode, answers.type, value);
                return setPrompt();
            });
        });
    };
    setPrompt();
};
