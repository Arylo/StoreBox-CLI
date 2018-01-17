import * as minimist from 'minimist';

const argv = minimist(process.argv.slice(2));

export const usage = "Usage: $0 upload [files..|folder]";

export const alias = "u";

export const handler = () => {
    const filepaths = argv._.slice(1);
};
