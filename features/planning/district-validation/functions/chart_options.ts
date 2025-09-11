export const options = (customTooltip: any) => {
    return {
        maintainAspectRatio: false,
        responsive: true,
        interaction: {
            mode: "index" as const,
        },
        plugins: {
            tooltip: {
                intersect: false,
                enabled: false,
                position: 'nearest' as const,
                external: customTooltip,
            },
            legend: {
                display: false,
            },
        },
        scales: {
            x: {
                ticks: {
                    autoSkip: false,
                },
                stacked: true,
            },
            y: {
                ticks: {
                    precision: 0,
                    beginAtZero: true,
                },
                stacked: true,
            },
        },
    };
};
