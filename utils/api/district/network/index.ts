import { axios, catchHelper, header } from "@libs/axios";

import { titleCase } from "@functions/common";

let regionalController: AbortController;
export const getRegional = (): Promise<string[]> => {
    if (regionalController) regionalController.abort();
    regionalController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_DISTRICT_URL + `/district/v1/networkdata/regional`, {
                headers: header(),
                signal: regionalController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

let witelController: AbortController;
export const getWitel = (args: { regional: string }): Promise<string[]> => {
    if (witelController) witelController.abort();
    witelController = new AbortController();

    const { regional } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_DISTRICT_URL + `/district/v1/networkdata/witel`, {
                params: {
                    regional: titleCase(regional),
                },
                headers: header(),
                signal: witelController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export interface Sto {
    sto: string;
    code: string;
}

let stoController: AbortController;
export const getSto = (args: { regional: string; witel: string }): Promise<Sto[]> => {
    if (stoController) stoController.abort();
    stoController = new AbortController();

    const { regional, witel } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_DISTRICT_URL + `/district/v2/networkdata/sto`, {
                params: {
                    regional,
                    witel,
                },
                headers: header(),
                signal: stoController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

let odcController: AbortController;
export const getOdc = (args: { regional: string; witel: string; sto: string }) => {
    if (odcController) odcController.abort();
    odcController = new AbortController();

    const { regional, witel, sto } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_DISTRICT_URL + `/district/v1/networkdata/odc`, {
                params: {
                    regional,
                    witel,
                    sto,
                },
                headers: header(),
                signal: odcController.signal,
                cache: false,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

let regionController: AbortController;
export const getRegionTsel = (args: { area?: string }): Promise<string[]> => {
    if (regionController) regionController.abort();
    regionController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_DISTRICT_URL + `/district/v1/networkdata/tsel/region`, {
                params: { area: args.area },
                headers: header(),
                signal: regionController.signal,
                cache: false,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};


let branchController: AbortController;
export const getBranchTsel = (args: { region: string }): Promise<string[]> => {
    if (branchController) branchController.abort();
    branchController = new AbortController();
    
    const { region } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_DISTRICT_URL + `/district/v1/networkdata/tsel/branch`, {
                params: {
                    region: region,
                },
                headers: header(),
                signal: branchController.signal,
                cache: false,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};