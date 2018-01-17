import config = require("../helpers/config");

export const usage = "Usage: $0 whoami";

export const describe = "Get Current User"

export const handler = () => {
    const username = config.get().username;
    console.log(username || "Warn: Unauthentication")
};
