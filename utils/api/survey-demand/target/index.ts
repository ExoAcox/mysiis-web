import { axios, catchHelper, header } from "@libs/axios";

interface GetTarget {
    row: number;
    page: number;
    regional: string;
    witel: string;
    vendor: string;
}

export interface Target {
    surveyid: number;
    periode: number;
    status: string;
    total: string;
    target: string;
    percent: number;
}

export const getTarget = (params: GetTarget) => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/targets/v1`, {
                params,
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

interface GetTargetArea {
    surveyid: string;
    periode_start: string;
    periode_end: string;
}

export interface TargetArea extends Target{
    area: string;
}

export interface TargetAreaParent {
    items: TargetArea[];
}

export const getTargetArea = (params: GetTargetArea): Promise<TargetAreaParent[]> => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/targets/v1/summary/area`, {
                params,
                headers: header(),
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

interface GetTargetRegional {
    surveyid: string;
    area: string;
    periode_start: string;
    periode_end: string;
}

export interface TargetRegional extends Target{
    area: string;
    regional: string;
}

export interface TargetRegionalParent {
    area: string;
    items: {
        regional: string;
        items: TargetRegional[];
    }[];
}

export const getTargetRegional = (params: GetTargetRegional): Promise<TargetRegionalParent[]> => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/targets/v1/summary/regional`, {
                params,
                headers: header(),
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

interface GetTargetWitel {
    surveyid: string;
    regional?: string;
    periode_start: string;
    periode_end: string;
}

export interface TargetWitel extends Target{
    regional: string;
    witel: string;
}

export interface TargetWitelParent {
    regional: string;
    items: {
        witel: string;
        items: TargetWitel[];
    }[];
}

export const getTargetWitel = (params: GetTargetWitel): Promise<TargetWitelParent[]> => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/targets/v1/summary/witel`, {
                params,
                headers: header(),
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

interface GetTargetVendor {
    regional?: string;
    witel?: string;
    surveyid: string;
    periode_start: string;
    periode_end: string;
};

export interface TargetVendor {
    surveyid: number;
    vendor: string;
    periode: number;
    status: string;
    total: string;
    target: string;
    percent: string;
}

export interface TargetVendorParent {
    vendor: {
        id: number;
        surveyor: string;
        keterangan: string;
    };
    items: TargetVendor[];
}

export const getTargetVendor = (params: GetTargetVendor): Promise<TargetVendorParent[]> => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/targets/v1/summary/vendor`, {
                params,
                headers: header(),
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
