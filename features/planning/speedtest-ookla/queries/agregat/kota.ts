import { getKabupatenDagri } from "@api/district/metadata";
import fetchKabupatenDetail from "./kabupaten";

import { markerMaps, polygonKelurahan } from "@pages/planning/speedtest-ookla/agregat-speedtest";

export type AgregatMaping = { lat: number, lng: number }[];
interface FetchKota {
    latLng: LatLng;
}

const fetchKota = async (args: FetchKota) => {
    const { latLng } = args;

    markerMaps.setPosition(latLng);
    polygonKelurahan.setPath([]);
    polygonKelurahan.setMap(null);

    try {
        const kota = await getKabupatenDagri(latLng);
        const code = kota.objectid;
        fetchKabupatenDetail({code})
    } catch (error) {}
}

export default fetchKota;