import { getKelurahanByLocation } from "@api/district/metadata";
import { OdpSource } from "@api/odp";

import { errorHelper } from "@functions/common";
import { convertAddressToString, getStreetName, parseLatLng, setMapNull } from "@functions/maps";

import {
    circleRadius,
    directionsRenderer,
    googleMaps,
    markerOdps,
    markerPin,
    markerSpeedtests,
    polygonBoundary,
    polygonClusters,
    polygonKelurahan,
    polygonSmartSales,
    polylineDirection,
    secondaryMarkerOdps,
} from "@pages/fulfillment/odp-view";

import { OdpFilter, kelurahanDefaultValue, useFilterStore, useKelurahanStore } from "../store";
import fetchOdp from "./odp";

interface FetchKelurahan {
    access: Access;
    source: OdpSource;
    radius: number;
    latLng: LatLng;
    filters: OdpFilter[];
}

const fetchKelurahan = async (args: FetchKelurahan) => {
    const { access, source, radius, filters, latLng } = args;

    markerPin.setPosition(latLng);
    googleMaps.panTo(latLng);
    polygonKelurahan.setPaths([]);
    polygonBoundary.setPaths([]);
    polylineDirection.setPath([]);
    directionsRenderer.setMap(null)

    if (googleMaps.getZoom()! < 17) googleMaps.setZoom(17);

    circleRadius.setMap(googleMaps);
    circleRadius.setCenter(latLng);
    circleRadius.setRadius(radius);

    setMapNull(markerOdps);
    setMapNull(secondaryMarkerOdps);
    setMapNull(polygonSmartSales);
    setMapNull(polygonClusters);
    setMapNull(markerSpeedtests);

    useFilterStore.setState({ smartsales: false, ipca_cluster: false, speedtest: false });

    if (access === "forbidden") {
        useKelurahanStore.setState({
            data: kelurahanDefaultValue,
            status: "resolve",
            error: null,
        });

        return fetchOdp({ access, source, radius, filters, latLng });
    }

    if (access === "unauthorized") {
        try {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: latLng }, (response) => {
                googleMaps.panTo(latLng);
                if (googleMaps.getZoom()! < 17) googleMaps.setZoom(17);

                useKelurahanStore.setState({
                    data: {
                        formattedAddress: response?.[0].formatted_address ?? "",
                        kode_desa_dagri: "",
                        kelurahan: "",
                        kecamatan: "",
                        kota: "",
                        provinsi: "",
                        regional: "",
                        witel: "",
                        lat: 0,
                        long: 0
                    },
                    status: "resolve",
                });
            });



            return fetchOdp({ access, source, radius, filters, latLng });

            // fetchOdp({ access, source, radius, filters, latLng });
        } catch (error) {
            useKelurahanStore.setState({ status: "reject", error: errorHelper(error) });
            return;
        }
    }

    try {
        const kelurahan = await getKelurahanByLocation({ lat: latLng.lat, long: latLng.lng });
        const st_name = await getStreetName(latLng);

        googleMaps.panTo(latLng);
        if (googleMaps.getZoom()! < 17) googleMaps.setZoom(17);

        polygonKelurahan.setPaths(parseLatLng(kelurahan.geom!));

        useKelurahanStore.setState({
            data: { ...kelurahan, formattedAddress: convertAddressToString({ st_name, ...kelurahan }) },
            status: "resolve",
        });
    } catch (error) {
        useKelurahanStore.setState({ status: "reject", error: errorHelper(error) });
        return;
    }

    fetchOdp({ access, source, radius, filters, latLng });
};

export default fetchKelurahan;
