import { ChartOptions } from "chart.js";

export const stateRegional = [{ label: "Semua Regional", value: "" }];

export const options = (): ChartOptions<"bar"> => {
    return {
        maintainAspectRatio: false,
        responsive: true,
        interaction: {
            mode: "nearest",
            intersect: true,
        },
        hover: {
            mode: "nearest",
            intersect: true,
        },
        plugins: {
            legend: {
                display: false,
            },
            tooltip: {
                mode: "nearest",
                intersect: false,
            },
        },
        scales: {
            xAxes: {
                ticks: {
                    autoSkip: true,
                },
                stacked: true,
            },
            yAxes: {
                ticks: {
                    autoSkip: true,
                    precision: 0,
                },
                beginAtZero: true,
                stacked: true,
            },
        },
    };
};
