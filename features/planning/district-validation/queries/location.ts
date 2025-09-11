import { googleMaps, mainMarker, mainPolygon, circleRadiusStreet } from "@pages/planning/district-validation/maps-summary";

import { getKelurahanByLocation } from "@api/district/metadata";
import { errorHelper } from "@functions/common";

import { useLocationStore } from "../store";
import { convertAddressToString, getStreetName } from "@functions/maps";

interface GetLocation {
    latLng: LatLng;
    radius: number;
}

const fetchLocation = async (args: GetLocation) => {
    const { latLng, radius } = args;

    mainMarker.setPosition(latLng);
    mainPolygon.setPath([]);
    mainPolygon.setMap(null);

    circleRadiusStreet.setMap(googleMaps);
    circleRadiusStreet.setCenter(latLng);
    circleRadiusStreet.setRadius(radius);

    try {
        const location = await getKelurahanByLocation({ lat: latLng.lat, long: latLng.lng });
        const st_name = await getStreetName({ lat: latLng.lat, lng: latLng.lng });

        googleMaps.panTo(latLng);
        if (googleMaps.getZoom()! < 14) googleMaps.setZoom(14);

        const normal = location.geom?.slice(0, 7) === "POLYGON";
        const path = location
            .geom!.slice(normal ? 9 : 15, normal ? -2 : -3)
            .split(",")
            .map((row) => {
                const split = row.split(" ");
                return { lat: parseFloat(split[1]), lng: parseFloat(split[0]) };
            });
        mainPolygon.setPath(path);
        mainPolygon.setMap(googleMaps);

        delete location.geom;
        useLocationStore.setState({ data: { ...location, streetAddress: convertAddressToString({ st_name, ...location }) }, status: "resolve" });
    } catch (error) {
        useLocationStore.setState({
            data: { kode_desa_dagri: "", kelurahan: "", kecamatan: "", kota: "", provinsi: "", regional: "", witel: "", lat: 0, long: 0 },
            error: errorHelper(error),
            status: "reject",
        });
    }
};

export default fetchLocation;
