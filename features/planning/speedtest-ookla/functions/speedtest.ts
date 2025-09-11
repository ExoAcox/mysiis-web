import { Ookla } from "@api/speedtest/ookla";

import { objectMap } from "@functions/common";

import { googleMaps, markersSpeedtests, polygonsSpeedtests } from "@pages/planning/speedtest-ookla/speedtest-ookla";

export const getColor = (isp: string) => {
    switch (isp) {
        case "Telkom":
            return "#EA001E";
        case "Biznet":
            return "#EC6C1A";
        case "MNC Play":
            return "#213F7B";
        case "FirstMedia":
            return "#0D9B4F";
        case "MyRepublic":
            return "#712C84";
        case "Balifiber":
            return "#FE8C00";
        case "Stroomnet":
            return "#0747A6";
        case "Oxygen":
            return "#017018";
        case "IM3 Ooredoo":
            return "#3DBAF8";
        case "Iconnet":
            return "#0096A6";
        case "CBN":
            return "#3DBAF8";
        case "XL Home":
            return "#02519E";
        case "XL":
            return "#02519E";
        case "Telkomsel":
            return "#EA001E";
        case "Indosat":
            return "#EC6C1A";
        case "INDOSAT":
            return "#EC6C1A";
        case "Smartfren":
            return "#FE8C00";
        case "3":
            return "#712C84";
        default:
            return "#FFFFDD";
    }
};

export const showMarkers = (label: string, speedtests: Ookla[]) => {
    const groupByLatLng: { [key: string]: Ookla[] } = {};

    speedtests.forEach((speedtest) => {
        const latLngStringify = String(speedtest.client_latitude) + "_" + String(speedtest.client_longitude);

        if (groupByLatLng[latLngStringify]) {
            groupByLatLng[latLngStringify] = [...groupByLatLng[latLngStringify], speedtest];
        } else {
            groupByLatLng[latLngStringify] = [speedtest];
        }
    });

    objectMap(groupByLatLng, (key) => {
        const latLng = key.split("_");
        const gap = 0.00005;

        const marker = new window.window.google.maps.Marker({
            map: googleMaps,
            position: { lat: Number(latLng[0]), lng: Number(latLng[1]) },
            icon: {
                anchor: new window.google.maps.Point(0, 0),
                url: `data:image/svg+xml;utf-8, \
                        <svg width="1" height="1" viewBox="0 0 1 1" xmlns="http://www.w3.org/2000/svg"> \
                        </svg>`,
            },
        });

        const paths = [
            { lat: Number(latLng[0]) - gap, lng: Number(latLng[1]) + gap },
            { lat: Number(latLng[0]) + gap, lng: Number(latLng[1]) + gap },
            { lat: Number(latLng[0]) + gap, lng: Number(latLng[1]) - gap },
            { lat: Number(latLng[0]) - gap, lng: Number(latLng[1]) - gap },
        ];

        const polygon = new window.google.maps.Polygon({
            map: googleMaps,
            paths: paths,
            strokeWeight: 0,
            fillOpacity: 0.35,
            fillColor: getColor(label),
            zIndex: 3,
        });

        const content = `
            <button class="min-w-[1.875rem] flex flex-col gap-1 justify-center items-center font-bold" id="isp_infowindow">
                <span>${label}</span>
                <span>${groupByLatLng[key].length}</span>
            </button>`;

        marker.set(
            "infoWindow",
            new window.google.maps.InfoWindow({
                disableAutoPan: true,
                content: content,
                zIndex: 2,
            })
        );

        const bounds = new window.google.maps.LatLngBounds();
        paths.forEach((bound) => bounds.extend(bound));

        marker.get("infoWindow").setPosition(bounds.getCenter());
        marker.get("infoWindow").open(googleMaps, marker);

        markersSpeedtests.push(marker);
        polygonsSpeedtests.push(polygon);
    });
};
