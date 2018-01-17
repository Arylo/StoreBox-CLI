import path = require("path");
import fs = require("fs");
import { isArray } from 'util';

interface ICommandModule {
    usage?: string;
    describe?: string;
    alias?: string[] | string;
    handler: Function;
}

interface ICommandObject extends ICommandModule {
    usage: string;
    describe: string;
    alias?: string[];
    command: string;
}

export const commandSelectObjs: ICommandObject[] = [ ];

const cmdFiles = fs.readdirSync(`${__dirname}/../cmds`)
    .filter((item) => /\.[jt]s$/.test(item))
    .map((item) => path.basename(item).replace(/\.[jt]s$/, ""));

for (const item of cmdFiles) {
    const m: ICommandModule = require(`../cmds/${item}`);
    const obj: ICommandObject = {
        usage: m.usage || "",
        describe: m.describe || "",
        command: item,
        handler: m.handler
    };

    if (m.alias) {
        obj.alias = [ ];
        if (!isArray(m.alias)) {
            m.alias = [ m.alias ];
        }
        for (const a of m.alias) {
            obj.alias.push(a);
        }
    }
    commandSelectObjs.push(obj);
}

export const commandSelects = (() => {
    const arr: string[] = [ ];
    for (const obj of commandSelectObjs) {
        arr.push(obj.command);
        if (!obj.alias) {
            continue;
        }
        for (const a of obj.alias) {
            arr.push(a);
        }
    }
    return arr;
})().sort();

export const commands = (() => {
    const OBJ: { [key: string]: ICommandObject } = { };
    for (const obj of commandSelectObjs) {
        OBJ[obj.command] = obj;
        if (!obj.alias) {
            continue;
        }
        for (const a of obj.alias) {
            OBJ[a] = obj;
        }
    }
    return OBJ;
})();

export const handlers = (() => {
    const OBJ: { [key: string]: Function } = { };
    for (const obj of commandSelectObjs) {
        OBJ[obj.command] = obj.handler;
        if (!obj.alias) {
            continue;
        }
        for (const a of obj.alias) {
            OBJ[a] = obj.handler;
        }
    }
    return OBJ;
})();