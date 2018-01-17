import minimist = require("minimist");
import path = require("path");
import fs = require("fs");
import { commandSelects, handlers } from './helpers/cmds';
import updateFolder = require('./helpers/uploaders/folder');
import updateFiles = require('./helpers/uploaders/files');

const argv = minimist(process.argv.slice(2), {
    boolean: [ "version", "help" ],
    alias: { v: "version", h: "help" }
});

if (argv.h) {
    handlers["help"]();
    process.exit(0);
}

if (argv.v) {
    console.info(`v${require("../package.json").version}`);
    process.exit(0);
}

if (argv._.length === 0) {
    handlers["help"]();
} else if (~commandSelects.indexOf(argv._[0])) {
    handlers[argv._[0]]();
} else {
    // Upload
    const cwd = process.cwd();

    let filepath = argv._[0];
    if (!path.isAbsolute(filepath)) {
        filepath = `${cwd}/${filepath}`;
    }
    if (fs.statSync(filepath).isDirectory()) {
        updateFolder.handler(filepath);
    } else {
        updateFiles.handler(argv._.map((item) => {
            if (!path.isAbsolute(item)) {
                return `${cwd}/${item}`;
            }
            return item;
        }));
    }

}

