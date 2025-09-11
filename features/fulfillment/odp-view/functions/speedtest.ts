import { Ookla } from "@api/speedtest/ookla";

export const getColor = (isp: string) => {
    switch (isp) {
        case "Telkom":
            return "#EA001E";
        case "Biznet":
            return "#2684FF";
        case "MNC Play":
            return "#FFC400";
        case "FirstMedia":
            return "#36B37E";
        case "MyRepublic":
            return "#8777D9";
        case "Balifiber":
            return "#FF8B00";
        case "Stroomnet":
            return "#0747A6";
        case "Oxygen":
            return "#2E3032";
        case "XL":
            return "#00B8D9";
        case "CBN":
            return "#76FF03";
        default:
            return "#FFFFDD";
    }
};

export const getDominantIsp = (array: Ookla[]) => {
    const store: { isp: string; value: number; averageSpeed: number }[] = [];
    array.forEach((speedtest) => {
        const index = store.findIndex((data) => data.isp === speedtest.flagging_isp);
        if (index >= 0) {
            const currentValue = store[index];
            store.splice(index, 1, {
                ...currentValue,
                value: currentValue.value + 1,
                averageSpeed: (currentValue.averageSpeed + Number(speedtest.download_kbps)) / (currentValue.value + 1),
            });
        } else {
            store.push({ isp: speedtest.flagging_isp, value: 1, averageSpeed: Number(speedtest.download_kbps) });
        }
    });

    return store.sort((a, b) => b.value - a.value);
};

export const getIcon = (isp: string) => {
    const svg = `<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
<g filter="url(#filter0_d_7911_117030)">
    <rect x="4" width="32" height="32" rx="16" fill="${getColor(isp)}" />
    <path
        d="M20 19C19.2044 19 18.4413 18.6839 17.8787 18.1213C17.3161 17.5587 17 16.7956 17 16C17 14.88 17.61 13.9 18.5 13.39L28.21 7.77L22.68 17.35C22.18 18.33 21.17 19 20 19ZM20 6C21.81 6 23.5 6.5 24.97 7.32L22.87 8.53C22 8.19 21 8 20 8C17.8783 8 15.8434 8.84285 14.3432 10.3431C12.8429 11.8434 12 13.8783 12 16C12 18.21 12.89 20.21 14.34 21.65H14.35C14.74 22.04 14.74 22.67 14.35 23.06C13.96 23.45 13.32 23.45 12.93 23.07C12 22.1426 11.2624 21.0407 10.7595 19.8274C10.2567 18.6141 9.99859 17.3134 10 16C10 13.3478 11.0536 10.8043 12.9289 8.92893C14.8043 7.05357 17.3478 6 20 6ZM30 16C30 18.76 28.88 21.26 27.07 23.07C26.68 23.45 26.05 23.45 25.66 23.06C25.5673 22.9675 25.4938 22.8576 25.4436 22.7366C25.3934 22.6157 25.3676 22.486 25.3676 22.355C25.3676 22.224 25.3934 22.0943 25.4436 21.9734C25.4938 21.8524 25.5673 21.7425 25.66 21.65C26.4037 20.9093 26.9934 20.0287 27.395 19.059C27.7966 18.0893 28.0023 17.0496 28 16C28 15 27.81 14 27.46 13.1L28.67 11C29.5 12.5 30 14.18 30 16Z"
        fill="white"
    />
</g>
<defs>
    <filter id="filter0_d_7911_117030" x="0" y="0" width="40" height="40" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
        <feFlood flood-opacity="0" result="BackgroundImageFix" />
        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
        <feOffset dy="4" />
        <feGaussianBlur stdDeviation="2" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_7911_117030" />
        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_7911_117030" result="shape" />
    </filter>
</defs>
</svg>`;

    return "data:image/svg+xml;charset=UTF-8;base64," + btoa(svg);
};
