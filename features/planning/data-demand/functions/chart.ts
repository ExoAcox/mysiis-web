import dayjs from "dayjs";
import { ChartOptions, ScriptableContext } from "chart.js";

import { ListDataResponses } from "@features/planning/data-demand/components/chart/MainChart";

export const colorPicker = (index: number) => {
    let color;
    switch (index) {
        case 0:
            color = "#FFC400";
            break;
        case 1:
            color = "#57C2D9";
            break;
        case 2:
            color = "#54B452";
            break;
        case 3:
            color = "#0065FF";
            break;
        case 4:
            color = "#8A5E07";
            break;
        case 5:
            color = "#A599E3";
            break;
        case 6:
            color = "#771E87";
            break;
        case 7:
            color = "#FB6382";
            break;
        case 8:
            color = "#BA0517";
            break;
        case 9:
            color = "#FF771C";
            break;
        case 10:
            color = "#8A6700";
            break;
        case 11:
            color = "#146624";
            break;
        case 12:
            color = "#871E5B";
            break;
        default:
            color = "#94194A";
            break;
    }
    return color;
};

export const getDaysArray = (start: string, end: string) => {
    const arr = [];
    for (let dt = new Date(start); dt <= new Date(end); dt.setDate(dt.getDate() + 1)) {
        arr.push(new Date(dt));
    }
    return arr;
};

export const hexToRgbA = (hex: string) => {
    let c: string[] | string;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
        c = hex.substring(1).split("");
        if (c.length == 3) {
            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
        }
        c = "0x" + c.join("");
        return "rgba(" + [(Number(c) >> 16) & 255, (Number(c) >> 8) & 255, Number(c) & 255].join(",") + ",";
    }
    return "rgba(255,255,255,"
};

export const options = (): ChartOptions<"line"> => {
    return {
        maintainAspectRatio: false,
        responsive: true,
        interaction: {
            mode: "index",
            intersect: true,
        },
        hover: {
            mode: "index",
            intersect: true,
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: "index",
                intersect: false,
            },
        },
        elements: {
            line: {
                tension: 0.3,
            },
            point: {
                radius: (context) => {
                    const index = context.dataIndex;
                    const length = context.dataset.data.length;
                    return length - 1 == index ? 3 : 0;
                },
            },
        },
        scales: {
            xAxes: {
                ticks: {
                    autoSkip: true,
                },
                title: {
                    display: true,
                    align: "end",
                    text: "Tanggal",
                    font: {
                        size: 14,
                        family: "Nunito",
                        weight: "600",
                    },
                },
            },
            yAxes: {
                ticks: {
                    autoSkip: true,
                    precision: 0,
                },
                beginAtZero: true,
            },
        },
    };
};

export const dataFormat = (data: ListDataResponses[], periodDate: Date[]) => {
    const labels = periodDate && periodDate?.map((object: Date) => dayjs(object).format("D"));

    return {
        labels: labels,
        datasets:
            data &&
            data?.map((item) => ({
                label: item?.witel,
                fillColor: 1,
                data: item?.data?.map((x, index) =>
                    x?.total ? parseInt(String(x?.total)) : index === 0 || index === item?.data?.length - 1 ? 0 : null
                ),
                backgroundColor: (context: ScriptableContext<"line">) => {
                    const ctx = context.chart.ctx;
                    const gradient = ctx.createLinearGradient(0, 0, 0, 510);
                    gradient?.addColorStop(0, item?.rgba + "0.5)");
                    gradient?.addColorStop(0.3, item?.rgba + "0.1)");
                    gradient?.addColorStop(1, item?.rgba + "0.0)");
                    return gradient;
                },
                borderColor: item?.color,
                borderWidth: 4,
                fill: "start",
                spanGaps: true,
            })),
    };
};
