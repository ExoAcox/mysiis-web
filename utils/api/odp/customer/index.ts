import { axios, catchHelper, header } from "@libs/axios";

let customerController: AbortController;
let customerIdController: AbortController;

export interface OdpCustomer {
    datel: string;
    kecamatan: string;
    kelurahan_desa: string;
    kode_desa: string;
    kota_kabupaten: string;
    latitude: number;
    longitude: number;
    notel_inet: string;
    provinsi: string;
    reg: string;
    sto: string;
    witel: string;
}

export interface GetOdpCustomer {
    lat: number;
    long: number;
    radius: number;
}

export const getOdpCustomer = (params: GetOdpCustomer): Promise<{ lists: OdpCustomer[]; total_count: number }> => {
    customerController?.abort();
    customerController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_ODP_URL + `/customer/v1/coordinate`, {
                params,
                headers: header(),
                signal: customerController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const getCustomerId = (params: { nomor: number }): Promise<OdpCustomer> => {
    customerIdController?.abort();
    customerIdController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_ODP_URL + `/customer/v1/nd`, {
                params,
                headers: header(),
                signal: customerIdController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};
