import { axios, header, catchHelper } from "@libs/axios";

let ipcaController: AbortController;

interface GetIpcaByWitel {
    regional: string;
    witel: string;
}

export interface Ipca {
    cluster_id: number;
    id_project?: number;
    jumlah_huni: number;
    potensi_hh: number;
    nama_lop: string;
    nama_segment: string;
    kode_desa: string;
    kelurahan: string;
    kecamatan: string;
    kabupaten: string;
    provinsi: string;
    regional: string;
    witel: string;
    status_priority: "PRIORITY" | "REGULER";
    geom?: string;
}

export const getIpcaByWitel = (args: GetIpcaByWitel): Promise<Ipca[]> => {
    if (ipcaController) ipcaController.abort();
    ipcaController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_ADDONS_URL + `/ipca/v1/witel`, {
                params: args,
                headers: header(),
                signal: ipcaController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export interface GetBuildingIpca {
    geom: string;
    id: number;
    id_project: string
    sumber: string
}

export const getBuildingIpcaById = (id: number): Promise<GetBuildingIpca[]> => {
    if (ipcaController) ipcaController.abort();
    ipcaController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_BUILDING_URL + `/building/v1/get-by-ipca?id_project=${id}`, {
                headers: header(),
                signal: ipcaController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export interface UimIpcaById {
    cluster_id: string;
    code_sto: string;
    device_id: number;
    devicename: string;
    deviceportnumber: number;
    f_olt: string;
    geom_point: null | string | number | object;
    kandatel: string;
    lat: number;
    long: number;
    networklocationcode: string;
    odc_name: string;
    odp_install: string;
    portblockednumber: number;
    portidlenumber: number;
    portinservicenumber: number;
    portreservednumber: number;
    regional: string;
    status_occ: string;
    stoname: string;
    tgl_proses: string;
    updated_date: string;
    updated_mysiis: string;
    valins_id: null | string | number;
    witel: string
}

export const getUimIpcaById = (id: number): Promise<UimIpcaById[]> => {
    if (ipcaController) ipcaController.abort();
    ipcaController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_ODP_URL + `/odp/v1/uim/ipca?id_project=${id}`, {
                headers: header(),
                signal: ipcaController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};
