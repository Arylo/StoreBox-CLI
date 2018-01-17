import * as minimist from 'minimist';
import path = require("path");
import { commandSelects, commands } from '../helpers/cmds';

const argv = minimist(process.argv.slice(2));

export const usage = [
    "Usage: $0 help <command>"
].join("\n");

export const alias = "h";

export const handler = () => {

    const $0 = path.basename(process.argv[1]);

    let usage = "";
    if (argv._.length === 0) {
        usage = progressHelpText();
    } else if (argv._.length === 1) {
        usage = commands[alias].usage;
    } else {
        usage = commands[argv._[1]].usage || "";
    }

    console.info(("\n" + usage).replace("$0", $0));
};

export const showHelp = () => {
    const $0 = path.basename(process.argv[1]);
    const usage = commands[argv._[0]].usage || "";
    console.info(("\n" + usage).replace("$0", $0));
};

const progressHelpText = () => {
    return [
        "Usage: $0 [files..|folder|<command>]", "",
        "Commands:", `  ${commandSelects.join(", ")}`, "",
        "Copyright 2018"
    ].join("\n");
};
