import ini = require('ini');
import lodash = require('lodash');
import os = require('os');
import fs = require('fs');
import path = require('path');
import mkdirp = require('mkdirp');
import utils = require('./utils');

export interface Config {
    url: string;
    version: string;
    [key: string]: string;
}

export let config: Config;

export const filepaths = [
    `${__dirname}/../config/upload.default.ini`,
    `${__dirname}/../config/upload.ini`,
    `${os.homedir()}/pbr/upload.ini`
];

export let read = () => {
    const configObjs = filepaths.filter((filepath) => {
        return fs.existsSync(filepath) && fs.statSync(filepath).isFile;
    }).map((filepath) => {
        return ini.parse(fs.readFileSync(filepath, { encoding: 'utf-8' }));
    });
    config = Object.assign({
        version: `v${require('../package.json').version}`
    }, ...configObjs)
    read = () => config;
    return config;
};

export enum SAVE_TYPE_OPTIONS {
    'local' = 'local',
    'global' = 'global'
}

export enum ACTION_TYPE_OPTIONS {
    'update' = 'update',
    'remove' = 'remove'
}

export const save = (
    key: keyof Config | Array<keyof Config>,
    type: SAVE_TYPE_OPTIONS = SAVE_TYPE_OPTIONS.local,
    action: ACTION_TYPE_OPTIONS = ACTION_TYPE_OPTIONS.update
) => {
    const filepath = filepaths[type === SAVE_TYPE_OPTIONS.local ? 2 : 1];
    const folderpath = path.dirname(filepath);
    const keys = utils.arrify(key);
    if (!fs.existsSync(folderpath)) {
        mkdirp.sync(folderpath);
    }
    const _config = fs.existsSync(filepath) ?
        ini.parse(fs.readFileSync(filepath, { encoding: 'utf-8' })) : { };
    if (action === ACTION_TYPE_OPTIONS.remove) {
        for (const key of keys) {
            delete _config[key];
        }
    } else {
        read();
        for (const key of keys) {
            _config[key] = config[key];
        }
    }
    fs.writeFileSync(filepath, ini.stringify(_config), { encoding: 'utf-8' });
    return true;
};
