import { parseFromWK } from "wkt-parser-helper";

import { Kelurahan } from "@api/district/metadata";

import { titleCase } from "./common";

export const createMap = (element: HTMLDivElement, options?: google.maps.MapOptions): Maps => {
    const googleMaps = new window.google.maps.Map(element, {
        zoom: 5.3,
        center: {
            lat: -0.7893,
            lng: 113.9213,
        },
        disableDefaultUI: true,
        gestureHandling: "greedy",
        clickableIcons: false,
        zoomControl: true,
        mapTypeControl: false,
        ...options,
    });

    googleMaps.setOptions({
        styles: [
            {
                featureType: "poi",
                elementType: "labels",
                stylers: [
                    {
                        visibility: "off",
                    },
                ],
            },
            {
                featureType: "transit",
                elementType: "labels",
                stylers: [
                    {
                        visibility: "off",
                    },
                ],
            },
        ],
    });

    return googleMaps;
};

export const googleMapsEvent = (id: string, event: string, callback: (e: Event) => void) => {
    const element = document.getElementById(id);
    element?.addEventListener(event, (e) => callback(e));
};

export const setMapNull = (instances: { setMap: (value: null) => void }[]) => {
    instances.forEach((instance) => instance.setMap(null));
    instances.length = 0;
};

export const getStreetName = (latLng: LatLng): Promise<string> => {
    return new Promise((resolve) => {
        try {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: latLng }, (response) => {
                const streetFilter = response?.[0].address_components.filter((x) => x.types[0] == "route");
                resolve(streetFilter?.[0]?.short_name || "");
            });
        } catch {
            resolve("");
        }
    });
};

export const convertAddressToString = (data: Kelurahan) => {
    const { st_name, kelurahan, kecamatan, kota, provinsi } = data;

    const regionType = kota.split(" ")[0] == "KOTA";
    const formattedKota = regionType ? kota.replace("KOTA ", "") : kota;
    const address = `${st_name}${st_name ? ", " : ""}Kel. ${titleCase(kelurahan)}, Kec. ${titleCase(kecamatan)}, ${
        regionType ? "Kota" : "Kab."
    } ${titleCase(formattedKota)}, ${titleCase(provinsi).replace("Dki", "DKI")}`;

    return address;
};

export const createDrawingManager = ({ color, googleMaps }: { color: string; googleMaps: Maps }) => {
    const drawing = new window.google.maps.drawing.DrawingManager({
        polygonOptions: {
            editable: true,
            draggable: true,
            strokeWeight: 5,
            fillOpacity: 0.5,
            fillColor: color,
            strokeColor: color,
            clickable: true,
        },
        drawingControl: false,
    });
    drawing.setMap(googleMaps);
    return drawing;
};

export const parseLatLng = (wkt: string) => {
    const object = parseFromWK(wkt);

    switch (object.type) {
        case "Polygon":
            return parseFromWK(wkt).coordinates?.[0].map((latLng: [number, number]) => ({ lat: latLng[1], lng: latLng[0] }));

        case "MultiPolygon":
            return parseFromWK(wkt).coordinates?.map((latLng1: [number, number][][]) => {
                return latLng1[0].map((latLng2) => ({ lat: latLng2[1], lng: latLng2[0] }));
            });

        default:
            return wkt;
    }
};
