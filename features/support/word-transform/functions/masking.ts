import { fuzzy } from "fast-fuzzy";

import { Mask } from "@api/rpa-wibs";

const replaceBulk = (str: string, findArray: string[], replaceArray: unknown[]) => {
    let i;
    let regex = [] as any;
    const map = {} as any;
    for (i = 0; i < findArray.length; i++) {
        regex.push(findArray[i].replace(/([-[\]{}()*+?.\\^$|#,])/g, "\\$1"));
        map[findArray[i]] = replaceArray[i];
    }
    regex = regex.join("|");
    str = str.replace(new RegExp(regex, "g"), (matched) => {
        return map[matched];
    });
    return str;
};

export const transformMaskText = (stringData: string, arrayData: Mask[]) => {
    const maskingConfigs = arrayData.reduce((object: any, value) => {
        object[value.words] = value.label;
        return object;
    }, {});

    const keyMask = Object.keys(maskingConfigs);
    const valueMask = Object.values(maskingConfigs);
    let skip = false;
    const arrayStringData = stringData.split(" ");
    const stringResult = stringData
        .split(" ")
        .map((word, index) => {
            if (skip) {
                skip = false;
                return null;
            }
            const key = keyMask.find((key) => {
                if (fuzzy(key, word) >= 0.8) return true;
            });
            if (key) return maskingConfigs[key];
            if (arrayStringData.length - 1 >= index + 1) {
                const key = keyMask.find((key) => {
                    if (
                        fuzzy(key, `${word} ${arrayStringData[index + 1]}`) >= 0.8 &&
                        fuzzy(key, `${word} ${arrayStringData[index + 1]}`) > fuzzy(key, arrayStringData[index + 1])
                    ) {
                        skip = true;
                        return true;
                    }
                });
                if (key) return maskingConfigs[key];
            }
            return word;
        })
        .filter((data) => data !== null)
        .join(" ");
    return replaceBulk(stringResult, keyMask, valueMask);
};
