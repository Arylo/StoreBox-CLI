import ora = require("ora");
import minimist = require("minimist");
import inquirer = require("inquirer");
import request = require('request');
import config = require('../helpers/config');
import validator = require("validator");
import { ConfigType } from '../helpers/config';

const argv = minimist(process.argv.slice(2), {
    boolean: ["global"],
    alias: { g: "global" }
});

export const usage = "Usage: $0 login";

export const handler = () => {
    inquirer.prompt([{
        type: "input",
        name: "username",
        message: "Username:",
        validate: (str: string) => {
            if (str.length < 1) {
                return "Must typy some words";
            }
            return true;
        }
    }, {
        type: "password",
        name: "password",
        message: "Password:",
        validate: (str: string) => {
            if (str.length < 1) {
                return "Must typy some words";
            }
            return true;
        }
    }]).then((answers) => {
        // TODO Params Valid Check
        const progress = ora("Logining").start();
        let data = "";
        request.post(config.get().login_url + "?token=true")
            .form({
                username: answers.username,
                password: answers.password
            })
            .on("data", (d) => {
                data += d.toString();
            })
            .on("error", (error) => {
                progress.fail("Login Error");
            })
            .on("end", () => {
                if (!validator.isJSON(data)) {
                    progress.fail("Login Error");
                    return data;
                }
                const json = JSON.parse(data);
                const mode = argv.g ? ConfigType.GLOBAL: ConfigType.USER;
                config.set(mode, "username", answers.username);
                config.set(mode, "token", json.token);
                progress.succeed("Logined");
            });
    });
};