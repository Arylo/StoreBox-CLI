import * as ora from 'ora';
export const handler = (folderpath: string) => {
    ora("WARN: The Feature has not been completed").fail();
    process.exit(0);
};
