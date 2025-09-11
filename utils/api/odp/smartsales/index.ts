import { axios, catchHelper, header } from "@libs/axios";

let smartSalesController: AbortController;

export interface SmartSales {
    grid_id: string;
    witel: string;
    region: string;
    kode_desa: string;
    jml_odp: string;
    portidlenumber: string;
    jml_un_real: string;
    jml_mdemand: string;
    jml_populasi_osm: string;
    jumlah_kk_kelurahan: string;
    jumlah_ktp_kelurahan: string;
    jumlah_penduduk_kelurahan: string;
    jumlah_kk_grid: number;
    jumlah_ktp_grid: number;
    jumlah_penduduk_grid: number;
    total_arpu: string;
    avg_arpu: string;
    jml_plg_hvc: string;
    jml_cust_indihome: string;
    jml_demand_prediksi: number;
    jml_churn: string;
    jml_ct0_total: string;
    segment_score_cap_ok: number;
    geom_grid?: string;
    last_updated: string;
}

export const getSmartSales = (params: { kode_desa_dagri: string }): Promise<{ lists: SmartSales[]; total_count: number }> => {
    smartSalesController?.abort();
    smartSalesController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_ODP_URL + `/smartsales/v1/fetch-by-kelurahan`, {
                params,
                headers: header(),
                signal: smartSalesController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};
