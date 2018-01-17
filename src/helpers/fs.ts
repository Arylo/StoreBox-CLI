import * as fs from "fs-extra";

export const isWritable = (path: string) => {
    try {
        fs.accessSync(path, fs.constants.W_OK);
    } catch (error) {
        return false;
    }
    return true;
};

export const isReadable = (path: string) => {
    try {
        fs.accessSync(path, fs.constants.R_OK);
    } catch (error) {
        return false;
    }
    return true;
};