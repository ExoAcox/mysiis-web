import ReactTooltip from "react-tooltip";

import { FormattedOdp } from "@functions/odp";

import { googleMaps, markerOdps, markerPin, secondaryMarkerOdps } from "@pages/fulfillment/odp-view";

import { OdpFilter, useOdpStore, useSecondOdpStore } from "../store";

export const filterOdp = (values: OdpFilter[]) => {
    let markers: Marker[] = [];
    let secondaryMarkers: Marker[] = [];

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

        secondaryMarkerOdps.forEach((marker) => {
            if (statusReady.includes(marker.get("status"))) {
                secondaryMarkers.push(marker);
            }
        });
    } else {
        markerOdps.forEach((marker) => {
            marker.setMap(googleMaps);
        });

        markers = markerOdps;
        secondaryMarkers = secondaryMarkerOdps;
    }

    if (values.includes("nearby")) {
        const markers_sorted: Marker[] = [];
        const markerSorted = markers.sort((marker1, marker2) => {
            const distance1 = window.google.maps.geometry.spherical.computeDistanceBetween(markerPin.getPosition()!, marker1.getPosition()!);
            const distance2 = window.google.maps.geometry.spherical.computeDistanceBetween(markerPin.getPosition()!, marker2.getPosition()!);
            return distance1 - distance2;
        });

        const secondary_markers_sorted: Marker[] = [];
        const secondaryMarkerSorted = secondaryMarkers.sort((marker1, marker2) => {
            const distance1 = window.google.maps.geometry.spherical.computeDistanceBetween(markerPin.getPosition()!, {
                lat: Number(marker1.get("lat")),
                lng: Number(marker1.get("lng")),
            });
            const distance2 = window.google.maps.geometry.spherical.computeDistanceBetween(markerPin.getPosition()!, {
                lat: Number(marker2.get("lat")),
                lng: Number(marker2.get("lng")),
            });
            return distance1 - distance2;
        });

        markerSorted.forEach((marker, index) => {
            marker.setMap(index < 3 ? googleMaps : null);
            if (index < 3) markers_sorted.push(marker);
        });

        secondaryMarkerSorted.forEach((marker, index) => {
            if (index < 3) secondary_markers_sorted.push(marker);
        });

        useOdpStore.setState({ data: { value: markers_sorted.length, percent: getOdpPercent(markers_sorted) }, status: "resolve", error: null });
        useSecondOdpStore.setState({
            data: { value: secondary_markers_sorted.length, percent: getOdpPercent(secondary_markers_sorted) },
            status: "resolve",
            error: null,
        });
    } else {
        useOdpStore.setState({ data: { value: markers.length, percent: getOdpPercent(markers) }, status: "resolve", error: null });
        useSecondOdpStore.setState({ data: { value: secondaryMarkers.length, percent: getOdpPercent(markers) }, status: "resolve", error: null });
    }
};

export const getOdpPercent = (odps: Marker[]) => {
    const devicePort = odps.map((odp) => odp.get("devicePort")).reduce((acc, data) => acc + data, 0);
    const idlePort = odps.map((odp) => odp.get("idlePort")).reduce((acc, data) => acc + data, 0);
    return parseFloat(((idlePort / devicePort) * 100).toFixed(1));
};

export const getOdpName = (source: string) => {
    switch (source) {
        case "valins":
            return { name: "Valins", reverseName: "UIM" };
        case "underspec":
            return { name: "Underspec", reverseName: "" };
        default:
            return { name: "UIM", reverseName: "Valins" };
    }
};

export const infoWindowContent = (odp: FormattedOdp, distance?: number) => {
    const section = (label: string, value: string | number) => {
        return `
        <div class="${"flex gap-5"}">
            <span class="${"w-[5.25rem]"}">${label}</span>
            <span>: <b class="${"font-bold"}">${value}</b></span>
        </div>`;
    };

    // <button id="infowindow-show-package" class="${"w-full bg-primary-40 rounded-lg border border-primary-40 text-white p-2 mt-2 font-bold active:bg-primary-50"}">
    //             Lihat Paket
    //         </button>

    const content = `
        <div class="${"p-1 text-medium flex flex-col gap-1 text-black-90"}" id="infowindow">
            ${section("Device ID", odp.deviceId)}
            ${section("Device Name", odp.name)}
            ${section("Status", odp.status)}
            ${section("Device Port", odp.devicePort)}
            ${section("Idle Port", odp.idlePort)}
            ${section("Updated Date", odp.date)}
            ${distance ? section("Distance", distance + "m") : ""}
            ${section("Latitude", odp.lat.toFixed(10))}
            ${section("Longitude", odp.lng.toFixed(10))}
            
            <button id="infowindow-copy-location" class="${"w-full bg-primary-40 rounded-lg border border-primary-40 text-white p-2 mt-2 font-bold active:bg-primary-50"}">
                Salin Lokasi
            </button>
        </div>`;

    return content;
};

export const getColorComponent = (status: string) => {
    switch (status) {
        case "RED":
            return (
                <span className="font-bold text-red-600" data-tip="Keterisian Port 100%">
                    Merah
                    <ReactTooltip />
                </span>
            );
        case "ORANGE":
            return (
                <span className="font-bold text-orange-500" data-tip="Keterisian Port >80%">
                    Oranye
                    <ReactTooltip />
                </span>
            );
        case "YELLOW":
            return (
                <span className="font-bold text-yellow-400" data-tip="Keterisian Port >40%">
                    Kuning
                    <ReactTooltip />
                </span>
            );
        case "GREEN":
            return (
                <span className="font-bold text-green-700" data-tip="Keterisian Port 1-40%">
                    Hijau
                    <ReactTooltip />
                </span>
            );
        case "BLACK_SYSTEM":
            return (
                <span className="font-bold text-black" data-tip="Port Ready for Sale">
                    Hitam
                    <ReactTooltip />
                </span>
            );
        default:
            return (
                <span className="font-bold text-black" data-tip="Port Ready to Connect">
                    Hitam
                    <ReactTooltip />
                </span>
            );
    }
};
