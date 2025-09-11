import { googleMaps } from "@pages/planning/speedtest-ookla/agregat-speedtest";

import { getKelurahanByLocation } from "@api/district/metadata";
import { errorHelper } from "@functions/common";

import { useLocationStore, locationData } from "../../store/agregat";
import fetchSummaryOoklaByKelurahan from "./summaryOoklaKelurahan";
import fetchKota from "./kota";

interface FetchKelurahan {
    latLng: LatLng;
}

const fetchKelurahan = async (args: FetchKelurahan) => {
    const { latLng } = args;

    useLocationStore.setState({ data: locationData, status: "idle", error: null });
    try {
        const kelurahan = await getKelurahanByLocation({ lat: latLng.lat, long: latLng.lng });
        googleMaps.panTo(latLng);
        if (googleMaps.getZoom()! < 14) googleMaps.setZoom(14);

        const code = Number(kelurahan.kode_desa_dagri);

        fetchSummaryOoklaByKelurahan({code});
        fetchKota({latLng});

        useLocationStore.setState({ data: {...kelurahan} , status: "resolve" });
    } catch (error) {
        useLocationStore.setState({ status: "reject", error: errorHelper(error) });
    }
};

export default fetchKelurahan;