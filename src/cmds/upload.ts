import * as minimist from 'minimist';
import { isAbsolute } from 'path';

const argv = minimist(process.argv.slice(2));

export const usage = "Usage: $0 upload [files..|folder]";

export const alias = "u";

export const handler = () => {
    const filepaths = argv._.slice(1);
    if (filepaths.length === 1 ) {
        // TODO FOLDER
        require("../helpers/uploaders/files").handler(filepaths);
    } else {
        require("../helpers/uploaders/files").handler(filepaths);
    }
};
