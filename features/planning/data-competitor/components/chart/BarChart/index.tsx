import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { memo } from "react";
import { Bar } from "react-chartjs-2";
import { ChartJSOrUndefined, ForwardedRef } from "react-chartjs-2/dist/types";
import { When } from "react-if";

import { ListDataResponses } from "@features/planning/data-competitor/components/chart/MainChart";
import { options } from "@features/planning/data-competitor/functions/chart";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Props {
    listData: ListDataResponses;
    chartRef?: ForwardedRef<ChartJSOrUndefined<"bar", number[], string>> | any;
}

const BarChart = ({ listData, chartRef = null }: Props) => {
    return (
        <When condition={!!listData}>
            <Bar options={options()} data={listData} height={100} ref={chartRef} />
        </When>
    );
};

export default memo(BarChart);
