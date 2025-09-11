import { axios, catchHelper, header } from "@libs/axios";

export interface TMaps {
    id: number;
    name?: string;
    provinsi: string;
    kota: string;
    kecamatan: string;
    kelurahan: string;
    type: "jalan" | "poi" | "kota" | "kelurahan";
    lat: number;
    long: number;
}

export let tmapsController: AbortController;
export const searchTMaps = (keyword: string): Promise<TMaps[]> => {
    if (tmapsController) tmapsController.abort();
    tmapsController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get("https://api-mysiis-ms-global-maps-khansia-dev.mysiis.io/api/nad/v1/newsearch", {
                params: { keyword },
                headers: { Authorization: header().Authorization },
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
