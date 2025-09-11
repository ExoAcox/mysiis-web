import { axios, catchHelper, header } from "@libs/axios";

interface GetNps {
    userId: string;
    settingId: string;
    days?: number;
}

export interface Rating {
    _id: string;
    rate: number;
}

export interface Nps {
    show_nps: boolean;
    ratings: Rating[];
    config: { config: { endDate: string } };
}

export const getNps = (params: GetNps): Promise<Nps> => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_NPS_URL + `/v2/rating/show`, { params, headers: header() })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

interface SubmitNps {
    ratingId: string;
    settingId: string;
    userId: string;
    comment?: string;
    user_data?: object;
}

export const submitNps = (params: SubmitNps): Promise<unknown> => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_NPS_URL + `/v2/user/rate-portofolio`, params, { headers: header() })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};
