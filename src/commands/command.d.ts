import minimist = require('minimist');

export interface Command {
    command?: string;
    options?: minimist.Opts;
    handler(argv: minimist.ParsedArgs): any;
    help?(argv: minimist.ParsedArgs): any;
    usage?: string;
}