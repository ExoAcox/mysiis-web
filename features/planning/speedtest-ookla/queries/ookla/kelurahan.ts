import { getKelurahanByLocation } from "@api/district/metadata";

import { errorHelper } from "@functions/common";

import {
    circleSpeedtest,
    googleMaps,
    markerMaps,
    markersSpeedtests,
    polygonKelurahan,
    polygonsSpeedtests,
} from "@pages/planning/speedtest-ookla/speedtest-ookla";

import { kelurahanSpeedtestData, useKelurahanSpeedtestStore } from "../../store/ookla";
import fetchOoklaByCoordinate from "./speedtestCoordinate";
import fetchOoklaByKelurahan from "./speedtestKelurahan";

interface FetchKelurahan {
    latLng: LatLng;
    radius: number;
    source: string;
    date: string;
    nextDate: string;
}

const fetchKelurahan = async (args: FetchKelurahan) => {
    const { latLng, radius, source, date, nextDate } = args;

    markerMaps.setPosition(latLng);
    polygonKelurahan.setPath([]);
    polygonKelurahan.setMap(null);

    markersSpeedtests.forEach((marker) => marker.setMap(null));
    polygonsSpeedtests.forEach((polygon) => polygon.setMap(null));

    circleSpeedtest.setMap(googleMaps);
    circleSpeedtest.setCenter(latLng);

    useKelurahanSpeedtestStore.setState({ data: kelurahanSpeedtestData, status: "idle", error: null });
    try {
        const kelurahan = await getKelurahanByLocation({ lat: latLng.lat, long: latLng.lng });

        googleMaps.panTo(latLng);
        if (googleMaps.getZoom()! < 14) googleMaps.setZoom(14);

        const normal = kelurahan.geom?.slice(0, 7) === "POLYGON";
        const path = kelurahan
            .geom!.slice(normal ? 9 : 15, normal ? -2 : -3)
            .split(",")
            .map((row) => {
                const split = row.split(" ");
                return { lat: parseFloat(split[1]), lng: parseFloat(split[0]) };
            });
        polygonKelurahan.setPath(path);
        polygonKelurahan.setMap(googleMaps);

        if (source === "radius") {
            circleSpeedtest.setRadius(radius);
            fetchOoklaByCoordinate({ latLng, radius, date, nextDate });
        } else {
            const code = Number(kelurahan.kode_desa_dagri);
            circleSpeedtest.setRadius(0);
            fetchOoklaByKelurahan({ code, date, nextDate });
        }

        useKelurahanSpeedtestStore.setState({ data: { ...kelurahan }, status: "resolve" });
    } catch (error) {
        useKelurahanSpeedtestStore.setState({ status: "reject", error: errorHelper(error) });
    }
};

export default fetchKelurahan;
