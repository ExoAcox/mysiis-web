import { CategoryScale, Chart as ChartJS, Filler, Legend, LineElement, LinearScale, PointElement, Title, Tooltip } from "chart.js";
import { memo } from "react";
import { Line } from "react-chartjs-2";
import { ChartJSOrUndefined, ForwardedRef } from "react-chartjs-2/dist/types";
import { When } from "react-if";

import { ListDataResponses } from "@features/planning/data-demand/components/chart/MainChart";
import { dataFormat, options } from "@features/planning/data-demand/functions/chart";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

interface Props {
    listData: ListDataResponses[];
    periodDate: Date[];
    chartRef?: ForwardedRef<ChartJSOrUndefined<"line", number[], string>> | any;
}

const LineChart = ({ listData = [], periodDate = [], chartRef = null }: Props) => {
    return (
        <When condition={listData?.length}>
            <Line ref={chartRef} options={options()} data={dataFormat(listData, periodDate)} />
        </When>
    );
};

export default memo(LineChart);
