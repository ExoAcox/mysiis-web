import { axios, catchHelper, header } from "@libs/axios";

export let tmapsController: AbortController;
export const searchTMaps = (keyword: string): Promise<Kelurahan[]> => {
    if (tmapsController) tmapsController.abort();
    tmapsController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_DISTRICT_URL + `/district/v2/metadata/search`, {
                params: { keyword },
                headers: header(),
                signal: tmapsController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export interface Kelurahan {
    st_name?: string;
    kode_desa_dagri: string;
    kelurahan: string;
    kecamatan: string;
    kota: string;
    provinsi: string;
    regional: string;
    witel: string;
    geom?: string;
}

export interface GetKelurahanByLocation {
    lat: number;
    long: number;
    isShowGeom?: boolean;
}

let kelurahanByLocationController: AbortController;
export const getKelurahanByLocation = (params: GetKelurahanByLocation): Promise<Kelurahan> => {
    if (kelurahanByLocationController) kelurahanByLocationController.abort();
    kelurahanByLocationController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_DISTRICT_URL + `/district/v1/metadata/kelurahan/location`, {
                params,
                headers: header(),
                signal: kelurahanByLocationController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

interface KabupatenDagri {
    geom: string;
    kota: string;
    objectid: number;
}

let kabupatenDagriController: AbortController;
export const getKabupatenDagri = (props: LatLng): Promise<KabupatenDagri> => {
    if (kabupatenDagriController) kabupatenDagriController.abort();
    kabupatenDagriController = new AbortController();

    const { lat, lng } = props;
    return new Promise((resolve, reject) => {
        axios
            .get(`${process.env.NEXT_PUBLIC_DISTRICT_URL}/district/v1/metadata/kabupaten/dagri`, {
                params: {
                    lat,
                    long: lng,
                },
                headers: header(),
                signal: kabupatenDagriController.signal,
            })
            .then((response) => {
                resolve(response.data.data[0]);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

type KabupatenDetailGeom = {
    kode_desa_dagri: string;
    provinsi: string;
    kota: string;
    kecamatan: string;
    kelurahan: string;
    geom: string;
};

let kelurahanGeomAbort: AbortController;
export const getKelurahanGeom = (props: LatLng): Promise<KabupatenDetailGeom[]> => {
    if (kelurahanGeomAbort) kelurahanGeomAbort.abort();
    kelurahanGeomAbort = new AbortController();

    const { lat, lng } = props;
    return new Promise((resolve, reject) => {
        axios
            .get(`${process.env.NEXT_PUBLIC_DISTRICT_URL}/district/v1/metadata/kelurahan/kabupaten-location?lat=${lat}&long=${lng}&isShowGeom=true`, {
                headers: header(),
                signal: kelurahanGeomAbort.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export interface KabupatenDetail {
    id_kab: number;
    kode_desa_dagri: string;
    provinsi: string;
    kota: string;
    kecamatan: string;
    kelurahan: string;
    polygon_kel: string;
}

let kabupatenDetailController: AbortController;
export const getKabupatenDetail = (code: number): Promise<[KabupatenDetail]> => {
    if (kabupatenDetailController) kabupatenDetailController.abort();
    kabupatenDetailController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(`${process.env.NEXT_PUBLIC_DISTRICT_URL}/district/v1/metadata/kabupaten/detail`, {
                params: { code },
                headers: header(),
                signal: kabupatenDetailController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

// =========---------------

let provinsiController: AbortController;
export const getProvinsi = (): Promise<[{ provinsi: string }]> => {
    if (provinsiController) provinsiController.abort();
    provinsiController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_DISTRICT_URL + `/district/v1/metadata/provinsi`, {
                headers: header(),
                signal: provinsiController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export interface ListKabupaten {
    st_name: string;
    kode_desa_dagri: string;
    kelurahan: string;
    kecamatan: string;
    kota: string;
    provinsi: string;
    long: number;
    lat: number;
}

let kabupatenController: AbortController;
export const getKabupaten = (args: { provinsi: string }): Promise<[ListKabupaten]> => {
    if (kabupatenController) kabupatenController.abort();
    kabupatenController = new AbortController();

    const { provinsi } = args;
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_DISTRICT_URL + `/district/v1/metadata/kabupaten`, {
                params: {
                    provinsi,
                },
                headers: header(),
                signal: kabupatenController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export interface Kecamatan {
    kecamatan: string;
}

let kecamatanController: AbortController;
export const getKecamatan = (args: { provinsi: string; kabupaten: string }): Promise<Kecamatan[]> => {
    if (kecamatanController) kecamatanController.abort();
    kecamatanController = new AbortController();

    const { provinsi, kabupaten } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_DISTRICT_URL + `/district/v1/metadata/kecamatan`, {
                params: {
                    provinsi,
                    kabupaten,
                },
                headers: header(),
                signal: kecamatanController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export interface Kelurahan {
    kecamatan: string;
    kelurahan: string;
    kode_desa_dagri: string;
    kota: string;
    lat: number;
    long: number;
    provinsi: string;
    st_name?: string;
}

let kelurahanController: AbortController;
export const getKelurahan = (args: { provinsi: string; kabupaten: string; kecamatan: string }): Promise<Kelurahan[]> => {
    if (kelurahanController) kelurahanController.abort();
    kelurahanController = new AbortController();

    const { provinsi, kabupaten, kecamatan } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_DISTRICT_URL + `/district/v1/metadata/kelurahan`, {
                params: {
                    provinsi,
                    kabupaten,
                    kecamatan,
                },
                headers: header(),
                signal: kelurahanController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

interface Location {
    name: string;
    id?: string;
    is_alternative?: boolean;
}
interface Address {
    kelurahan?: string;
    kecamatan?: string;
    kota?: string;
    provinsi?: string;
}
export interface Ncx {
    lat?: number;
    long?: number;
    google?: {
        address_components: { long_name: string; short_name: string; types: string[] }[];
        formatted_address?: string;
    };
    ncx?: {
        kelurahan: Location;
        kecamatan: Location;
        kabupaten: Location;
        provinsi: Location;
    };
    googleAddress: Address;
    addressNcx: Address;
    ncx_pendekatan: Address;
}

let ncxController: AbortController;
export const getNcx = (args: LatLng): Promise<Ncx> => {
    if (ncxController) ncxController.abort();
    ncxController = new AbortController();

    const { lat, lng } = args;
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_DISTRICT_URL + `/district/v2/metadata/translate/ncx/prod/google`, {
                params: {
                    lat,
                    long: lng,
                },
                headers: header(),
                signal: ncxController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export interface Street {
    lat?: number;
    long?: number;
    radius?: number;
    geom?: string;
    kecamatan: string;
    kelurahan: string;
    kode_desa_dagri: string;
    kota: string;
    provinsi: string;
    st_name?: string;
    multiline?: boolean;
    name_street?: string;
}

let streetController: AbortController;
export const getStreet = (params: { lat: number; long: number; radius?: number }): Promise<Street[]> => {
    if (streetController) streetController.abort();
    streetController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_DISTRICT_URL + `/district/v1/metadata/street`, {
                params,
                headers: header(),
                signal: streetController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export interface MissingStreet {
    start_date: string;
    end_date: string;
    reason: string;
    page: number;
    count?: number;
    detail?: { count: number; tanggal: string }[];
    provinsi?: string;
    labels?: string[];
    datasets?: { data: number[]; label: string };
    row?: number;
    kota?: string;
    kecamatan?: string;
    kabupaten?: string;
    kelurahan?: string;
}

let missingStreetController: AbortController;
export const getSummaryNcxMiss = (args: { start_date: string; end_date: string; reason: string }): Promise<MissingStreet[]> => {
    if (missingStreetController) missingStreetController.abort();
    missingStreetController = new AbortController();

    const { start_date, end_date, reason } = args;
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_DISTRICT_URL + `/district/v1/metadata/district-ncx-miss/summary`, {
                params: {
                    start_date,
                    end_date,
                    reason,
                },
                headers: header(),
                signal: missingStreetController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export interface DataTable {
    row: number;
    page: number;
    provinsi: string;
    kota: string;
    kelurahan: string;
    kecamatan: string;
    kabupaten: string;
    start_date: string;
    end_date: string;
    reason: string;
}

interface Lists {
    created_at: string;
    geom: string;
    id: number;
    lat: number;
    long: number;
    mysiis_kecamatan: string;
    mysiis_kelurahan: string;
    mysiis_kode_desa_dagri: string;
    mysiis_kota: string;
    mysiis_lat: string;
    mysiis_long: string;
    mysiis_provinsi: string;
    mysiis_st_name: string;
}

interface ListMissingStreet {
    filteredCount: string;
    lists: Lists[];
    totalCount: string;
}

let missingStreetListController: AbortController;
export const getNcxMiss = (args: DataTable | MissingStreet): Promise<ListMissingStreet> => {
    if (missingStreetListController) missingStreetListController.abort();
    missingStreetListController = new AbortController();

    const { row, page, provinsi, kota, kelurahan, kecamatan, kabupaten, start_date, end_date, reason } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_DISTRICT_URL + `/district/v1/metadata/district-ncx-miss`, {
                params: {
                    row,
                    page,
                    provinsi,
                    kota,
                    kelurahan,
                    kecamatan,
                    kabupaten,
                    start_date,
                    end_date,
                    reason,
                },
                headers: header(),
                signal: missingStreetListController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};
