const validationUserRole = (roles: string[], roleAccess: string[]) => {
    const status = roleAccess.some((role) => roles.includes(role));
    return status;
};

function isDecimal(num: number, round = 2) {
    let result;
    if (num % 1 != 0) {
        result = num.toFixed(round);
    } else {
        result = num;
    }

    return result;
}

export const capitalize = (word: string) => {
    let result = "";
    if (word) {
        const lower = word.toLowerCase();
        result = word.charAt(0).toUpperCase() + lower.slice(1);
    }
    return result;
};

export const roleAccess = [
    "supervisor-survey-mitra",
    "admin-survey-mitra",
    "admin-survey-branch",
    "admin-survey-region",
    "admin-survey-nasional",
    "nik_admin-survey-branch",
    "nik_admin-survey-region",
];

export const listRegional = ["Regional 1", "Regional 2", "Regional 3", "Regional 4", "Regional 5", "Regional 6", "Regional 7"].map((e) => ({
    label: e,
    value: e,
}));

export { validationUserRole, isDecimal };
