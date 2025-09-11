import { googleMaps, markerPin, markerDemands, clusterDemands } from "@pages/planning/data-demand/maps-summary";
import randomLocation from "random-location";

import dayjs from "dayjs";

import { getRespondentByValid, Respondent } from "@api/survey-demand/respondent";
import { getRandomScaleOfNeedId } from "@features/planning/data-demand/functions/maps";

import { errorHelper } from "@functions/common";

import {
    useRespondentStore,
    respondentDefaultValue,
    useDataRespondentStore,
    dataRespondentDefaultValue,
    useBoundsRespondentStore,
} from "@features/planning/data-demand/store/maps";

interface FetchRespondent {
    regional: string;
    witel: string;
    period: string;
}

const fetchRespondent = async (args: FetchRespondent, access: Access) => {
    const { regional, witel, period } = args;

    if (access !== "allowed") return fetchDummyRespondent();

    useRespondentStore.setState({ data: respondentDefaultValue, status: "pending" });
    useDataRespondentStore.setState({ data: dataRespondentDefaultValue, status: "pending" });
    useBoundsRespondentStore.setState({ bounds: null });

    try {
        const respondents = await getRespondentByValid({
            page: 1,
            row: 1000,
            periode_start: dayjs(period).subtract(1, "month").format("YYYYMM"),
            periode_end: dayjs(period).format("YYYYMM"),
            is_only_odp_ready: false, //Default true, because error 504
            is_simple: false, //Default true, because useModal Respondent
            treg: regional,
            witel,
            arr_conf_scale_of_needid: ["10", "11", "12"],
        });

        let scale10 = 0;
        let scale11 = 0;
        let scale12 = 0;

        const dataScale10: Respondent[] = [];
        const dataScale11: Respondent[] = [];
        const dataScale12: Respondent[] = [];

        const bounds = new window.google.maps.LatLngBounds();

        const markers = respondents.lists.map((respondent) => {
            const marker: Marker = new window.google.maps.Marker({
                map: googleMaps,
                position: { lat: Number(respondent.latitude), lng: Number(respondent.longitude) },
                opacity: 0,
            });

            marker.set("scale", respondent.conf_scale_of_needid);
            marker.set("data", respondent);

            const section = (label: string, value: string | number) => {
                return `
                <div class="${"flex gap-5"}">
                    <span class="${"shrink-0 w-[3.5rem]"}">${label}</span>
                    <span class="${"whitespace-nowrap"}">: <b class="${"font-bold"}">${value}</b></span>
                </div>`;
            };

            const content = `
            <div class="${"p-1 text-medium space-y-1 text-black-90"}">
                ${section("ID", respondent.id)}
                ${section("Latitude", respondent.latitude)}
                ${section("Longitude", respondent.longitude)}
                ${section("Nama", respondent.name || "-")}
                ${section("No HP", respondent.phone || "-")}
                ${section("Regional", respondent.lat_long_treg || "-")}
                ${section("Witel", respondent.witel || "-")}
                ${section("Skala", respondent.conf_scale_of_need_value || "-")}
            </div>`;

            marker.set(
                "infoWindow",
                new window.google.maps.InfoWindow({
                    content,
                })
            );

            switch (respondent.conf_scale_of_needid) {
                case 10:
                    scale10++;
                    dataScale10.push(respondent);
                    break;
                case 11:
                    scale11++;
                    dataScale11.push(respondent);
                    break;
                case 12:
                    scale12++;
                    dataScale12.push(respondent);
                    break;
                default:
                    break;
            }

            markerDemands.push(marker);
            bounds.extend(new window.google.maps.LatLng(Number(respondent.latitude), Number(respondent.longitude)));

            return marker;
        });

        clusterDemands.addMarkers(markers);
        googleMaps.fitBounds(bounds);

        useRespondentStore.setState({ data: { 10: scale10, 11: scale11, 12: scale12 }, status: "resolve" });
        useDataRespondentStore.setState({ data: { 10: dataScale10, 11: dataScale11, 12: dataScale12 }, status: "resolve" });
        useBoundsRespondentStore.setState({ bounds });
    } catch (error) {
        useRespondentStore.setState({ status: "reject", error: errorHelper(error) });
        useDataRespondentStore.setState({ status: "reject", error: errorHelper(error) });
    }
};

const fetchDummyRespondent = () => {
    const bounds = new window.google.maps.LatLngBounds();
    let scale10 = 0;
    let scale11 = 0;
    let scale12 = 0;

    const dummyRespondents = Array.from({ length: 500 }).map(() => {
        const dummyLatLng = randomLocation.randomCirclePoint(
            { latitude: markerPin.getPosition()?.lat(), longitude: markerPin.getPosition()?.lng() },
            10000
        );
        const dummyScale = getRandomScaleOfNeedId();

        const marker: Marker = new window.google.maps.Marker({
            map: googleMaps,
            position: { lat: dummyLatLng.latitude, lng: dummyLatLng.longitude },
            opacity: 0,
        });

        marker.set("scale", dummyScale);

        switch (dummyScale) {
            case 10:
                scale10++;
                break;
            case 11:
                scale11++;
                break;
            case 12:
                scale12++;
                break;
            default:
                break;
        }

        markerDemands.push(marker);
        bounds.extend(new window.google.maps.LatLng(dummyLatLng.latitude, dummyLatLng.longitude));

        return marker;
    });

    clusterDemands.addMarkers(dummyRespondents);
    googleMaps.fitBounds(bounds);

    useRespondentStore.setState({ data: { 10: scale10, 11: scale11, 12: scale12 }, status: "resolve" });
};

export default fetchRespondent;
