export const stateWitel = [
    {
        label: "ACEH",
        value: "ACEH",
    },
    {
        label: "BABEL",
        value: "BABEL",
    },
    {
        label: "BENGKULU",
        value: "BENGKULU",
    },
    {
        label: "JAMBI",
        value: "JAMBI",
    },
    {
        label: "LAMPUNG",
        value: "LAMPUNG",
    },
    {
        label: "MEDAN",
        value: "MEDAN",
    },
    {
        label: "RIDAR",
        value: "RIDAR",
    },
    {
        label: "RIKEP",
        value: "RIKEP",
    },
    {
        label: "SUMBAR",
        value: "SUMBAR",
    },
    {
        label: "SUMSEL",
        value: "SUMSEL",
    },
    {
        label: "SUMUT",
        value: "SUMUT",
    },
];

export const fetchDefaultWitel = (regional: string) => {
    switch (regional) {
        case "Regional 1":
            return "SUMUT";
        case "Regional 2":
            return "BANTEN";
        case "Regional 3":
            return "BANDUNG";
        case "Regional 4":
            return "SEMARANG";
        case "Regional 5":
            return "NTT";
        case "Regional 6":
            return "KALBAR";
        case "Regional 7":
            return "SULSELBAR";
        default:
            return "";
    }
};
