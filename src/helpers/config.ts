import os = require("os");
import path = require("path");
import fs = require("fs-extra");
import ini = require("ini");
import { isReadable, isWritable } from './fs';

const defaultConfigPath = `${__dirname}/../../config/upload.default.ini`;
const globalConfigPath = `${__dirname}/../../config/upload.ini`;
const userConfigPath = `${os.homedir()}/.pbr/upload.ini`;

interface IConfig {
    username?: string;
    token?: string;
    login_url?: string;
    file_upload_url?: string;
    files_upload_url?: string;
}

export const get = (): IConfig => {
    let defaultConfig: IConfig = { };
    let globalConfig: IConfig = { };
    let userConfig: IConfig = { };

    if (isReadable(defaultConfigPath)) {
        defaultConfig = ini.parse(fs.readFileSync(defaultConfigPath, "utf-8"));
    }

    if (isReadable(globalConfigPath)) {
        globalConfig = ini.parse(fs.readFileSync(globalConfigPath, "utf-8"));
    }

    if (isReadable(userConfigPath)) {
        userConfig = ini.parse(fs.readFileSync(userConfigPath, "utf-8"));
    }

    return Object.assign({ }, defaultConfig, globalConfig, userConfig);
};

export enum ConfigType {
    GLOBAL, USER
}

const iniHeader = [
    ";;;;",
    "; This is an automatically generated configuration file.",
    "; Do not modify or delete.",
    ";;;;"
].join("\n") + "\n";

export const set = (type=ConfigType.USER, key: keyof IConfig, value: string) => {
    let configPath = "";
    if (type === ConfigType.GLOBAL) {
        configPath = globalConfigPath;
    } else if (type === ConfigType.USER) {
        configPath = userConfigPath;
    } else {
        throw new Error("Unknown Config Type");
    }

    if (!fs.pathExistsSync(configPath)) {
        const folderPath = path.dirname(configPath);
        if (!fs.pathExistsSync(folderPath)) {
            fs.mkdirpSync(folderPath);
        }
        fs.writeFileSync(configPath, "");
    }

    if (!isWritable(configPath)) {
        throw new Error("Config File inst Writable");
    }
    if (!isReadable(configPath)) {
        throw new Error("Config File inst Readable");
    }

    const config = ini.parse(fs.readFileSync(configPath, "utf-8"));
    config[key] = value;
    if (!value || value.trim() === "") {
        delete config[key];
    }
    fs.writeFileSync(configPath, iniHeader + ini.stringify(config));
};
