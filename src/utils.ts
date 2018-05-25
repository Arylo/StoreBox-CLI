export const recode = (arr: string[], val) => {
    return arr.reduce((obj, item) => {
        obj[item] = val;
        return obj;
    }, { });
};

export const arrify = <T>(val: T | T[]) => {
    return Array.isArray(val) ? val : [val];
};
