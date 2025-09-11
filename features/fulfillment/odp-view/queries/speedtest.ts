import dayjs from "dayjs";

import { Ookla, getOoklaByCoordinate } from "@api/speedtest/ookla";

import { useModalOutside } from "@hooks/useModal";

import { errorHelper, objectMap } from "@functions/common";

import { googleMaps, markerSpeedtests } from "@pages/fulfillment/odp-view";

import { getDominantIsp, getIcon } from "@features/fulfillment/odp-view/functions/speedtest";

import { useSpeedtestStore } from "../store";

interface FetchSpeedtest {
    latLng: LatLng;
    radius: number;
}

const fetchSpeedtest = async (args: FetchSpeedtest) => {
    const { latLng, radius } = args;

    useSpeedtestStore.setState({ data: 0, status: "pending", error: null });

    try {
        const speedtests = await getOoklaByCoordinate({
            lat: latLng.lat,
            long: latLng.lng,
            radius,
            start_date: dayjs().subtract(1, "month").format("YYYY-MM-DD"),
            end_date: dayjs().format("YYYY-MM-DD"),
        });

        const groupByLatLng: { [key: string]: Ookla[] } = {};

        speedtests.lists.forEach((speedtest) => {
            const latLngStringify = String(speedtest.client_latitude) + "_" + String(speedtest.client_longitude);

            if (groupByLatLng[latLngStringify]) {
                groupByLatLng[latLngStringify] = [...groupByLatLng[latLngStringify], speedtest];
            } else {
                groupByLatLng[latLngStringify] = [speedtest];
            }
        });

        objectMap(groupByLatLng, (key, values) => {
            const dominantSpeedtests = getDominantIsp(values);

            const latLng = key.split("_");
            const gap = 0.00025;

            const paths = [
                { lat: Number(latLng[0]) - gap, lng: Number(latLng[1]) + gap },
                { lat: Number(latLng[0]) + gap, lng: Number(latLng[1]) + gap },
                { lat: Number(latLng[0]) + gap, lng: Number(latLng[1]) - gap },
                { lat: Number(latLng[0]) - gap, lng: Number(latLng[1]) - gap },
            ];

            const marker = new window.google.maps.Marker({
                map: googleMaps,
                position: { lat: Number(latLng[0]), lng: Number(latLng[1]) },
                icon: {
                    url: getIcon(dominantSpeedtests[0].isp),
                },
                // strokeWeight: 0,
                // fillOpacity: 0.35,
                // fillColor: getColor(dominantSpeedtests[0].isp),
                zIndex: 3,
            });

            // const content = `
            // <div class="${"p-1 pt-2 text-medium space-y-1 text-black-90"}">
            //     ${dominantSpeedtests
            //         .map((speedtest) => {
            //             return `
            //         <div class="${"flex gap-5"}">
            //             <span class="${"w-[4.5rem]"}">${speedtest.isp}</span>
            //             <span>: <b class="${"font-bold"}">${speedtest.value}</b></span>
            //         </div>`;
            //         })
            //         .join("")}
            // </div>`;

            // polygon.set(
            //     "infoWindow",
            //     new window.google.maps.InfoWindow({
            //         position: new window.google.maps.LatLng(Number(latLng[0]), Number(latLng[1])),
            //         content,
            //     })
            // );

            // polygon.addListener("mouseover", () => {
            //     polygonSpeedtests.forEach((polygon) => polygon.get("infoWindow").close());
            //     polygon.get("infoWindow").open(googleMaps);
            // });

            // polygon.addListener("mouseout", () => {
            //     polygonSpeedtests.forEach((polygon) => polygon.get("infoWindow").close());
            // });

            marker.addListener("click", () => {
                useModalOutside("odp-view/speedtest", { visible: true, data: { speedtest: dominantSpeedtests } });
            });

            markerSpeedtests.push(marker);
        });

        useSpeedtestStore.setState({ data: speedtests.total_count, status: "resolve" });
    } catch (error) {
        useSpeedtestStore.setState({ status: "reject", error: errorHelper(error) });
    }
};

export default fetchSpeedtest;
