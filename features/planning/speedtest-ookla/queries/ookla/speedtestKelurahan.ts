import { useSpeedtestStore, useSpeedtestCardStore } from "../../store/ookla";

import { getOoklaByKelurahan, Ookla } from "@api/speedtest/ookla";
import { errorHelper } from "@functions/common";

interface FetchSpeedtest {
    code: number;
    date: string;
    nextDate: string;
}

const fetchOoklaByKelurahan = async (args: FetchSpeedtest) => {
    const { code, date, nextDate } = args;
    
    useSpeedtestStore.setState({ data: { lists: [], total_count: 0 }, status: "pending", error: null });

    try {
        const speedtests = await getOoklaByKelurahan({
            kode_desa_dagri: code,
            start_date: date,
            end_date: nextDate,
        });

        const dataIsp: { [key: string]: Ookla[] } = {};
        const dataOperator: { [key: string]: Ookla[] } = {};
        speedtests.lists.forEach((speedtests) => {
            dataIsp[speedtests.flagging_isp] = dataIsp[speedtests.flagging_isp] ? [...dataIsp[speedtests.flagging_isp], speedtests] : [speedtests];

            dataOperator[speedtests.network_operator_name] = dataOperator[speedtests.network_operator_name] ? [...dataOperator[speedtests.network_operator_name], speedtests] : [speedtests];
        });

        const arrayIsp: {label: string; list: Ookla[]}[] = [];
        Object.keys(dataIsp).forEach(function (key) {
            arrayIsp.push({ label: key, list: dataIsp[key] });
        });

        const arrayOperator: {label: string; list: Ookla[]}[] = [];
        Object.keys(dataOperator).forEach(function (key) {
            arrayOperator.push({ label: key, list: dataOperator[key] });
        });

        useSpeedtestCardStore.setState({ 
            dataIsp: arrayIsp.sort((a, b) => b.list.length - a.list.length), 
            dataOperator: arrayOperator.sort((a, b) => b.list.length - a.list.length),
            ispPolygonLabel: dataIsp,
            operatorPolygonLabel: dataOperator
        });

        useSpeedtestStore.setState({ data: { lists: speedtests.lists, total_count: speedtests.total_count }, status: "resolve" });
    } catch (error) {
        useSpeedtestStore.setState({ status: "reject", error: errorHelper(error) });
    }
};

export default fetchOoklaByKelurahan;
