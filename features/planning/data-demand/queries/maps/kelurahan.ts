import { googleMaps, circleRadius, markerPin, infoWindowDemand, markerDemands, clusterDemands } from "@pages/planning/data-demand/maps-summary";

import { useKelurahanStore, kelurahanDefaultValue } from "../../store/maps";

import { getKelurahanByLocation } from "@api/district/metadata";
import { getStreetName, convertAddressToString, setMapNull } from "@functions/maps";

import fetchRespondent from "./respondent";

import { errorHelper } from "@functions/common";

interface FetchKelurahan {
    latLng: LatLng;
    period: string;
}

const fetchKelurahan = async (args: FetchKelurahan, access: Access) => {
    const { latLng, period } = args;

    markerPin.setPosition(latLng);
    clusterDemands.clearMarkers();
    setMapNull(markerDemands);

    circleRadius.setMap(null);
    circleRadius.setRadius(0);

    infoWindowDemand.close();
    googleMaps.panTo(latLng);
    if (googleMaps.getZoom()! < 17) googleMaps.setZoom(17);

    if (access !== "allowed") {
        useKelurahanStore.setState({
            data: { ...kelurahanDefaultValue, formattedAddress: "Ini hanya data dummy, silahkan login untuk melihat data yg asli" },
            status: "resolve",
            error: null,
        });

        return fetchRespondent({ regional: "", witel: "", period }, access);
    }

    useKelurahanStore.setState({ data: kelurahanDefaultValue, status: "idle", error: null });

    try {
        const location = await getKelurahanByLocation({ lat: latLng.lat, long: latLng.lng });
        const st_name = await getStreetName(latLng);
        useKelurahanStore.setState({ data: { ...location, formattedAddress: convertAddressToString({ st_name, ...location }) }, status: "resolve" });

        fetchRespondent({ regional: location.regional, witel: location.witel, period }, access);
    } catch (error) {
        useKelurahanStore.setState({
            status: "reject",
            error: errorHelper(error),
        });
    }
};

export default fetchKelurahan;
