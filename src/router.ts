import minimist = require('minimist');
import { keys, commands, DEF_COMMAND } from './commands';
import { read } from './config';
import { isFunction } from 'util';

type ARGV_TYPE = minimist.ParsedArgs & {
    help: boolean;
    h: boolean;
    version: boolean;
    v: boolean;
};

export const argv = minimist(process.argv.slice(2), {
    boolean: ['help', 'version'],
    alias: {
        'help': 'h',
        'version': 'v'
    }
}) as ARGV_TYPE;

export const getCommand = (command: string) => {
    if (!~keys.indexOf(command)) {
        return DEF_COMMAND;
    }
    const coms = commands.filter((com) => com.command === command);
    if (coms.length === 0) {
        return DEF_COMMAND;
    }
    return coms[0];
}

export const runCommand = (command: string) => {
    const m = getCommand(command);
    const mArgv = minimist(process.argv.slice(2), m.options || { });
    mArgv._.shift();
    try {
        const p = m.handler(mArgv);
        if (p && isFunction(p.then) && isFunction(p.catch)) {
            p.catch(() => {
                getCommand('help').handler({ _: [command] })
            });
        }
    } catch (error) {
        getCommand('help').handler({ _: [command] })
    }
};

export const route = () => {
    if (argv.v) {
        return console.log(read().version);
    }
    const command = argv._[0];
    if (argv.help || !command || keys.indexOf(command) === -1) {
        return runCommand('help');
    }
    runCommand(command);
};
