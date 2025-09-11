import { googleMaps, markerOdps, markerPin } from "@pages/planning/data-demand/maps-summary";

import { getOdpPercent } from "@features/fulfillment/odp-view/functions/odp";
import { OdpFilter } from "@features/fulfillment/odp-view/store";

import { useOdpViewStore } from "../store/maps";

export const filterOdpView = (values: OdpFilter[]) => {
    let markers: Marker[] = [];

    if (values.includes("ready")) {
        const statusReady = ["GREEN", "YELLOW", "ORANGE"];

        markerOdps.forEach((marker) => {
            if (statusReady.includes(marker.get("status"))) {
                marker.setMap(googleMaps);
                markers.push(marker);
            } else {
                marker.setMap(null);
            }
        });
    } else {
        markerOdps.forEach((marker) => {
            marker.setMap(googleMaps);
        });

        markers = markerOdps;
    }

    if (values.includes("nearby")) {
        const markers_sorted: Marker[] = [];
        const markerSorted = markers.sort((marker1, marker2) => {
            const distance1 = window.google.maps.geometry.spherical.computeDistanceBetween(markerPin.getPosition()!, marker1.getPosition()!);
            const distance2 = window.google.maps.geometry.spherical.computeDistanceBetween(markerPin.getPosition()!, marker2.getPosition()!);
            return distance1 - distance2;
        });

        markerSorted.forEach((marker, index) => {
            marker.setMap(index < 3 ? googleMaps : null);
            if (index < 3) markers_sorted.push(marker);
        });

        useOdpViewStore.setState({ data: { value: markers_sorted.length, percent: getOdpPercent(markers_sorted) }, status: "resolve", error: null });
    } else {
        useOdpViewStore.setState({ data: { value: markers.length, percent: getOdpPercent(markers) }, status: "resolve", error: null });
    }
};
