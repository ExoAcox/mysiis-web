import { axios, catchHelper, header } from "@libs/axios";

let ooklaController: AbortController;

export interface Ookla {
    brand: string;
    client_city: string;
    client_latitude: number;
    client_longitude: number;
    client_region_name: string;
    device_id: string;
    download_kbps: string;
    ds: string;
    flagging_isp: string;
    geohash_loc: string;
    geom: string;
    isp_name: string;
    latency: number;
    network_operator_name: string;
    server_latitude: number;
    server_longitude: number;
    server_name: string;
    source: string;
    test_id: string;
    treg: string;
    upload_kbps: string;
    witel: string;
}

interface GetOoklaByCoordinate {
    lat: number;
    long: number;
    radius: number;
    start_date: string;
    end_date: string;
}

export const getOoklaByCoordinate = (params: GetOoklaByCoordinate): Promise<{ lists: Ookla[]; total_count: number }> => {
    if (ooklaController) ooklaController.abort();
    ooklaController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_ODP_URL + `/ookla/v1/coordinate`, {
                params,
                headers: header(),
                signal: ooklaController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

interface GetOoklaByKelurahan {
    kode_desa_dagri: number;
    start_date: string;
    end_date: string;
}

export const getOoklaByKelurahan = (params: GetOoklaByKelurahan): Promise<{ lists: Ookla[]; total_count: number }> => {
    if (ooklaController) ooklaController.abort();
    ooklaController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_ODP_URL + `/ookla/v1/kelurahan`, {
                params,
                headers: header(),
                signal: ooklaController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export interface Agregat {
    avg_dl: number;
    avg_ul: number;
    max_dl: number;
    max_ul: number;
    min_dl: number;
    min_ul: number;
    top_isp: string;
    top_network_operator: string;
    total: number;
}

export const getSummaryOoklaByKelurahan = (params: { kode_desa_dagri: number }): Promise<Agregat> => {
    if (ooklaController) ooklaController.abort();
    ooklaController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_ODP_URL + `/ookla/v1/kelurahan/summary`, {
                params,
                headers: header(),
                signal: ooklaController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};
