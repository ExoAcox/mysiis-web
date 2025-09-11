import getConfig from "next/config";

import { axios, catchHelper } from "@libs/axios";

let feedbackController: AbortController;

export interface GetAllMultilayer {
    row?: number;
    page?: number;
    kelurahan?: string;
}

export interface ListAllMultilayer {
    _id: string;
    lat: number;
    long: number;
    prediksi: number;
    cluster: string;
    provinsi: string;
    occ_rate: string;
    grid_id?: string;
    kabupaten_kota?: string;
    kecamatan?: string;
    desa_kelurahan?: string;
    zona_nilai_tanah?: number;
    jml_bangunan?: number;
    jml_testing_ookla?: number;
    jml_pelanggan_indihome?: number;
    jml_port_odp?: number;
    cluster_geo?: string;
    warning?: string;
    kode_desa_dagri?: number;
    sum_download_kbps?: number;
    sum_upload_kbps?: number;
    jumlah_speed_test_pada_kelurahan?: number;
    slope?: number;
    avg_download_kbps?: number;
    avg_upload_kbps?: number;
    recommended_estimated_downspeed_kbps?: number;
    recommended_estimated_upspeed_kbps?: number;
}

export interface AllMultilayer {
    totalData: number;
    lists: ListAllMultilayer[];
}

export const getAllMultilayer = (args: GetAllMultilayer): Promise<AllMultilayer> => {
    feedbackController?.abort();
    feedbackController = new AbortController();

    const { row = 1000, page = 1, kelurahan } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_MULTILAYER_URL + "/feedback/v1/data-science/maps", {
                params: { row, page, desa_kelurahan: kelurahan },
                auth: { username: process.env.NEXT_PUBLIC_TELKOM_USERNAME, password: process.env.NEXT_PUBLIC_NPS_PASSWORD },
                signal: feedbackController.signal,
            })
            .then((response) => {
                resolve({ lists: response.data.data, totalData: response.data.meta?.all_data });
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};
