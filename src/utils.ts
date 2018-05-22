export const recode = (arr: string[], val) => {
    return arr.reduce((obj, item) => {
        obj[item] = val;
        return obj;
    }, { });
};