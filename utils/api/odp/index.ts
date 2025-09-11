import { axios, catchHelper, header } from "@libs/axios";

let getOdpController: AbortController;

export type StatusOcc = "GREEN" | "YELLOW" | "ORANGE" | "RED" | "BLACK" | "BLACK_SYSTEM";

export type OdpSource = "uim" | "valins" | "underspec";
export interface GetOdp {
    source: OdpSource;
    lat: number;
    long: number;
    radius: number;
    isBoundaryActive?: boolean;
}

export interface OdpUim {
    device_id: number;
    devicename: string;
    lat: number;
    long: number;
    status_occ_add: StatusOcc;
    portidlenumber: string;
    deviceportnumber: string;
    odp: string;
    updated_mysiis: string;
    networklocationcode: string;
    code_sto: string;
    portinservicenumber: number;
    odp_install: string;
}

export interface OdpValins {
    valins_id: number;
    device_id: number;
    devicename: string;
    latitude: number;
    longitude: number;
    status_occ_add: StatusOcc;
    portidlenumber: string;
    deviceportnumber: number;
    odp: string;
    valins_at: string;
    networklocationcode: string;
    code_sto: string;
}

export type Odp = OdpUim | OdpValins;
export interface OdpBoundary {
    odp: Odp[];
    polygon: string;
}

export const getOdp = (args: GetOdp): Promise<Odp[] | OdpBoundary> => {
    getOdpController?.abort();
    getOdpController = new AbortController();

    const { source, lat, long, radius, isBoundaryActive } = args;

    const boundary = isBoundaryActive ? "/river-and-street" : "";

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_ODP_URL + `/odp/v1/${source}${boundary}`, {
                params: {
                    lat,
                    long,
                    radius,
                },
                headers: header(),
                signal: getOdpController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export interface OdpUimByKelurahan {
    summary: {
        total_port: {
            portidlenumber: number;
            deviceportnumber: number;
        };
        status_occ_add: {
            red: number;
            orange: number;
            yellow: number;
            green: number;
            black_system: number;
            black: number;
        };
    };
    lists: OdpUim[];
}

export const getOdpUimByKelurahan = (kode: string): Promise<OdpUimByKelurahan> => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_ODP_URL + `/odp/v1/uim/get-by-kelurahan`, { params: { kode }, headers: header() })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export interface OdpUimMiniByKabupaten {
    long: number;
    lat: number;
}

export const getOdpUimMiniByKabupaten = (args: { provinsi: string; kota: string }): Promise<OdpUimMiniByKabupaten[]> => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_ODP_URL + `/odp/v1/uim/mini/get-by-kab`, {
                params: args,
                headers: header(),
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export interface GetPackage {
    deviceId: string;
    networkLocationCode: string;
    stoCode: string;
}

export interface Package {
    SPEED: string;
    FLAG: string;
    TIPE_PAKET: string;
    PRICE_TOTAL: string;
}

let getPackageController: AbortController;
export const getPackage = (args: GetPackage): Promise<{ packageXml: Package[] }[]> => {
    getPackageController?.abort();
    getPackageController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_ODP_URL + `/odp/v1/package`, {
                params: args,
                headers: header(),
                signal: getPackageController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};
