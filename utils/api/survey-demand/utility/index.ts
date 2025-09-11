import { axios, catchHelper, header } from "@libs/axios";

export interface Vendor {
    id: number;
    surveyor: string;
    keterangan: string;
}

let vendorController: AbortController;
export const getVendor = (): Promise<Vendor[]> => {
    if (vendorController) vendorController.abort();
    vendorController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/utility/v1/list-surveyor`, {
                params: { 
                    telkomsel: true
                },
                headers: header(),
                signal: vendorController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export interface Tahap {
    tahap_survey: number;
}

let tahapController: AbortController;
export const getTahap = (): Promise<Tahap[]> => {
    if (tahapController) tahapController.abort();
    tahapController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/utility/v1/tahap-survey`, {
                headers: header(),
                signal: tahapController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const getWitelByUser = (userId: string) => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/utility/v1/supervisors/v1/${userId}`, {
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
