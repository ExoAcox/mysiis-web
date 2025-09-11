import randomLocation from "random-location";

import { Odp, OdpSource, OdpUim, OdpValins, StatusOcc } from "@api/odp";

import { mathRandom } from "./common";

export interface FormattedOdp {
    deviceId: number;
    name: string;
    lat: number;
    lng: number;
    status: StatusOcc;
    idlePort: number;
    devicePort: number;
    date: string;
    networkLocationCode: string;
    stoCode: string;
    valinsId?: number;
}

export const formatOdpToGeneral = (odps: Odp[], source: OdpSource): FormattedOdp[] => {
    switch (source) {
        case "uim":
            return (odps as OdpUim[]).map((odp) => {
                return {
                    deviceId: odp.device_id,
                    name: odp.devicename,
                    lat: odp.lat,
                    lng: odp.long,
                    status: odp.status_occ_add,
                    idlePort: Number(odp.portidlenumber),
                    devicePort: Number(odp.deviceportnumber),
                    date: odp.updated_mysiis?.slice(0, 10),
                    networkLocationCode: odp.networklocationcode,
                    stoCode: odp.code_sto,
                };
            });
        case "valins":
            return (odps as OdpValins[]).map((odp) => {
                return {
                    valinsId: odp.valins_id,
                    deviceId: odp.device_id,
                    name: odp.devicename,
                    lat: odp.latitude,
                    lng: odp.longitude,
                    status: odp.status_occ_add,
                    idlePort: Number(odp.portidlenumber),
                    devicePort: Number(odp.deviceportnumber),
                    date: odp.valins_at?.slice(0, 10),
                    networkLocationCode: odp.networklocationcode,
                    stoCode: odp.code_sto,
                };
            });
        case "underspec":
            return (odps as OdpValins[]).map((odp) => {
                return {
                    valinsId: odp.valins_id,
                    deviceId: odp.device_id,
                    name: odp.devicename,
                    lat: Number(odp.latitude),
                    lng: Number(odp.longitude),
                    status: odp.status_occ_add,
                    idlePort: Number(odp.portidlenumber),
                    devicePort: Number(odp.deviceportnumber),
                    date: odp.valins_at?.slice(0, 10),
                    networkLocationCode: odp.networklocationcode,
                    stoCode: odp.code_sto,
                };
            });
        default:
            return [];
    }
};

export const odpIconSvg = (status: StatusOcc) => {
    let color;
    switch (status) {
        case "RED":
            color = "red";
            break;
        case "ORANGE":
            color = "orange";
            break;
        case "YELLOW":
            color = "yellow";
            break;
        case "GREEN":
            color = "green";
            break;
        default:
            color = "black";
    }

    return {
        anchor: new window.google.maps.Point(10, 10),
        url: `data:image/svg+xml;utf-8, \
          <svg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"> \
            <circle cx="10" cy="10" r="${status === "BLACK_SYSTEM" ? 6 : 8}" fill="${color}" ${status === "BLACK_SYSTEM" ? `stroke="green" stroke-width="4"` : ""
            }></circle> \
          </svg>`,
    };
};

const statusOcc = ["RED", "ORANGE", "YELLOW", "GREEN"];
export const getRandomStatusOcc = () => {
    const color = statusOcc[Math.floor(mathRandom() * statusOcc.length)] as StatusOcc;
    return color;
};

const odps: { idlePort: number, status: StatusOcc }[] = [
    { idlePort: 0, status: "RED" },
    { idlePort: 2, status: "ORANGE" },
    { idlePort: 4, status: "YELLOW" },
    { idlePort: 6, status: "GREEN" },
    { idlePort: 8, status: "BLACK" },
    { idlePort: 8, status: "BLACK_SYSTEM" },
];
export const getRandomOdp = ({ latLng, radius }: { latLng: LatLng; radius: number }) => {
    const location = randomLocation.randomCirclePoint({ latitude: latLng.lat, longitude: latLng.lng }, radius);
    const odp = odps[Math.floor(mathRandom() * statusOcc.length)];

    return {
        ...odp,
        name: "ODP-DUM-MY/99",
        devicePort: 8,
        lat: location.latitude,
        lng: location.longitude,
        deviceId: 13532,
        date: "2024-03-24",
        networkLocationCode: "code",
        stoCode: "stro",

    };
};
