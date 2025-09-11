import { extendTailwindMerge } from "tailwind-merge";
import fontSize from "@styles/theme/fonts.json";
import clsx from "clsx";

const customTwMerge = extendTailwindMerge({
    classGroups: {
        "font-size": [{ text: Object.keys(fontSize) }],
        "max-w": [{ "max-w": ["default"] }],
    },
});

export const tw = (...classNames: (string | boolean | undefined)[]) => {
    return customTwMerge(clsx(...classNames));
};

export const hexToRgb = (hex: string, alpha = 1) => {
    const shorthand = hex.length === 4;

    const r = parseInt(hex.slice(1, shorthand ? 2 : 3), 16);
    const g = parseInt(hex.slice(shorthand ? 2 : 3, shorthand ? 3 : 5), 16);
    const b = parseInt(hex.slice(shorthand ? 3 : 5, shorthand ? 4 : 7), 16);

    if (alpha) {
        return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
    } else {
        return "rgb(" + r + ", " + g + ", " + b + ")";
    }
};

export const getFontSize = (size: Size, prefix = "") => {
    const data = {
        h1: `${prefix}text-h1`,
        h2: `${prefix}text-h2`,
        h3: `${prefix}text-h3`,
        h4: `${prefix}text-h4`,
        h5: `${prefix}text-h5`,
        caption: `${prefix}text-caption`,
        small: `${prefix}text-small`,
        medium: `${prefix}text-medium`,
        large: `${prefix}text-large`,
        subtitle: `${prefix}text-subtitle`,
    };

    return data[size];
};
