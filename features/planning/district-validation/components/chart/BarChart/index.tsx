import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { Bar } from "react-chartjs-2";
import ReactDom from "react-dom";
import uniqolor from "uniqolor";

import { MissingStreet, getSummaryNcxMiss } from "@api/district/metadata";

import { options } from "../../../functions/chart_options";
import TooltipComponent from "../TooltipComponent";

interface Props {
    filter: MissingStreet;
}

interface DateArray {
    [key: string]: number | string;
}

interface DataChart {
    labels: string[];
    datasets: {
        label: string;
        data: number[];
        backgroundColor: string[];
    }[];
}

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const BarChart: React.FC<Props> = ({ filter }: Props) => {
    const [dataChart, setDataChart] = useState<DataChart>({
        labels: [""],
        datasets: [
            {
                label: "",
                data: [0],
                backgroundColor: [""],
            },
        ],
    });

    const chartRef = useRef();

    const getData = () => {
        setDataChart({
            labels: [""],
            datasets: [
                {
                    label: "",
                    data: [0],
                    backgroundColor: [""],
                },
            ],
        });
        getSummaryNcxMiss(filter)
            .then((result) => {
                const array: any[] = [];
                let currDate = dayjs(filter.start_date).subtract(1, "day").startOf("day");
                const lastDate = dayjs(filter.end_date).startOf("day");
                let idx = 0;
                currDate = currDate.add(1, "day");
                while (currDate.diff(lastDate) <= 0) {
                    const dateArray: DateArray = {
                        date: dayjs(currDate.clone().toDate()).format("YYYY-MM-DD"),
                    };

                    result.forEach((data: MissingStreet) => {
                        dateArray[data.provinsi!] = 0;
                    });

                    idx++;
                    array.push(dateArray);
                    currDate = currDate.add(1, "day");
                    if (idx == 40) {
                        break;
                    }
                }

                result.forEach((data: MissingStreet) => {
                    data.detail!.forEach((date) => {
                        const index = array.findIndex((arr) => arr.date === date.tanggal);
                        array[index] = { ...array[index], [data.provinsi!]: date.count };
                    });
                });

                const label = array.map((data) => String(data.date));

                const chartData = {
                    labels: label,
                    datasets: result.map((data) => {
                        return {
                            label: data.provinsi!,
                            // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
                            data: array.map((arr) => Number(arr[data?.provinsi!])),
                            backgroundColor: result.map(() => uniqolor.random().color),
                        };
                    }),
                };

                setDataChart(chartData);
            })
            .catch((err) => err);
    };

    const customTooltip = (context: any) => {
        const filteredData = context.tooltip.dataPoints
            .filter((data: any) => data.label)
            .map((data: any) => {
                return {
                    label: dataChart.datasets[data.datasetIndex]?.label,
                    value: dataChart.datasets[data.datasetIndex]?.data?.[data.dataIndex],
                };
            });

        let tooltipEl = document.getElementById("chartjs-tooltip");

        if (!tooltipEl) {
            tooltipEl = document.createElement("div");
            tooltipEl.id = "chartjs-tooltip";
            tooltipEl.innerHTML = "<table></table>";
            document.body.appendChild(tooltipEl);
        }

        const tooltipModel = context.tooltip;
        if (tooltipModel.opacity === 0) {
            tooltipEl.style.opacity = "0";
            return;
        }

        tooltipEl.classList.remove("above", "below", "no-transform");
        if (tooltipModel.yAlign) {
            tooltipEl.classList.add(tooltipModel.yAlign);
        } else {
            tooltipEl.classList.add("no-transform");
        }

        if (tooltipModel.body) {
            const titleLines = tooltipModel.title;
            ReactDom.render(<TooltipComponent list={filteredData} title={titleLines} />, tooltipEl);
        }

        const position = context.chart.canvas.getBoundingClientRect();

        if (!tooltipEl.style) return;

        tooltipEl.style.opacity = "1";
        tooltipEl.style.position = "absolute";
        tooltipEl.style.top = "220px";
        tooltipEl.style.padding = tooltipModel.padding + "px" + tooltipModel.padding + "px";
        tooltipEl.style.pointerEvents = "none";

        if (tooltipModel.caretX - context.chart.canvas.offsetWidth / 2 <= 50) {
            tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + "px";
        } else if (tooltipModel.caretX + context.chart.canvas.offsetWidth / 2 >= window.innerWidth - 50) {
            tooltipEl.style.left = window.innerWidth - context.chart.canvas.offsetWidth / 2 - 80 + "px";
        } else {
            tooltipEl.style.left = "245px";
        }
    };

    useEffect(() => {
        getData();
    }, [filter.start_date, filter.end_date, filter.reason]);

    return (
        <div>
            <Bar ref={chartRef} data={dataChart} height={400} options={options(customTooltip)} />
        </div>
    );
};

export default BarChart;
