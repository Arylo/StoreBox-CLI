import * as ora from 'ora';
import * as minimist from 'minimist';
import { set, ConfigType } from '../helpers/config';

const argv = minimist(process.argv.slice(2), {
    boolean: ["global"],
    alias: { g: "global" }
});

export const usage = "Usage: $0 logout";

export const handler = () => {
    const mode = argv.g ? ConfigType.GLOBAL: ConfigType.USER;
    set(mode, "token", "");
    // TODO LOGOUT Action
    ora("Logouted").succeed()
};