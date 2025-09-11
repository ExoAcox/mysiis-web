import { Ookla, getOoklaByCoordinate } from "@api/speedtest/ookla";

import { errorHelper } from "@functions/common";

import { googleMaps, markersSpeedtests, polygonsSpeedtests } from "@pages/planning/speedtest-ookla/speedtest-ookla";

import { getColor, showMarkers } from "../../functions/speedtest";
import { useSpeedtestCardStore, useSpeedtestStore } from "../../store/ookla";

interface FetchSpeedtest {
    latLng: LatLng;
    radius: number;
    date: string;
    nextDate: string;
}

const fetchOoklaByCoordinate = async (args: FetchSpeedtest) => {
    const { latLng, radius, date, nextDate } = args;

    useSpeedtestStore.setState({ data: { lists: [], total_count: 0 }, status: "pending", error: null });

    try {
        const speedtests = await getOoklaByCoordinate({
            lat: latLng.lat,
            long: latLng.lng,
            radius,
            start_date: date,
            end_date: nextDate,
        });

        const dataIsp: { [key: string]: Ookla[] } = {};
        const dataOperator: { [key: string]: Ookla[] } = {};
        speedtests.lists.forEach((speedtest) => {
            dataIsp[speedtest.flagging_isp] = dataIsp[speedtest.flagging_isp] ? [...dataIsp[speedtest.flagging_isp], speedtest] : [speedtest];

            dataOperator[speedtest.network_operator_name] = dataOperator[speedtest.network_operator_name]
                ? [...dataOperator[speedtest.network_operator_name], speedtest]
                : [speedtest];
        });

        const arrayIsp: { label: string; list: Ookla[] }[] = [];
        Object.keys(dataIsp).forEach(function (key) {
            arrayIsp.push({ label: key, list: dataIsp[key] });
        });

        const arrayOperator: { label: string; list: Ookla[] }[] = [];
        Object.keys(dataOperator).forEach(function (key) {
            arrayOperator.push({ label: key, list: dataOperator[key] });
        });

        useSpeedtestCardStore.setState({
            dataIsp: arrayIsp.sort((a, b) => b.list.length - a.list.length),
            dataOperator: arrayOperator.sort((a, b) => b.list.length - a.list.length),
            ispPolygonLabel: dataIsp,
            operatorPolygonLabel: dataOperator,
        });

        useSpeedtestStore.setState({ data: { lists: speedtests.lists, total_count: speedtests.total_count }, status: "resolve" });
    } catch (error) {
        useSpeedtestStore.setState({ status: "reject", error: errorHelper(error) });
    }
};

export default fetchOoklaByCoordinate;
