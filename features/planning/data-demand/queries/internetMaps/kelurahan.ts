import { googleMaps, markerPin, markerDemands } from "@pages/planning/data-demand/internet-summary";

import { useKelurahanStore, kelurahanDefaultValue } from "../../store/maps";

import { getKelurahanByLocation } from "@api/district/metadata";
import { getStreetName, convertAddressToString, setMapNull } from "@functions/maps";

import fetchInternet from "./internet";

import { errorHelper } from "@functions/common";

interface Props {
    latLng: LatLng;
    predict: string[];
    cluster: string[];
}

const fetchKelurahan = async (args: Props, access: Access) => {
    const { latLng, predict, cluster } = args;

    markerPin.setPosition(latLng);
    setMapNull(markerDemands);

    googleMaps.panTo(latLng);
    if (googleMaps.getZoom()! < 17) googleMaps.setZoom(17);

    if (access !== "allowed") return;

    useKelurahanStore.setState({ data: kelurahanDefaultValue, status: "pending", error: null });

    try {
        const location = await getKelurahanByLocation({ lat: latLng.lat, long: latLng.lng });
        const st_name = await getStreetName(latLng);

        useKelurahanStore.setState({ data: { ...location, formattedAddress: convertAddressToString({ st_name, ...location }) }, status: "resolve" });

        fetchInternet({ kelurahan: location.kelurahan, predict, cluster }, access);
    } catch (error) {
        useKelurahanStore.setState({
            status: "reject",
            error: errorHelper(error),
        });
    }
};

export default fetchKelurahan;
