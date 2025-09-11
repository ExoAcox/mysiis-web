import { axios, catchHelper, header } from "@libs/axios";

interface GetQuotaRegional {
    regional: string;
    timestamp: string;
}

interface ListQuotaWitel {
    witel: string;
    total_quota?: number;
    total_selected?: number;
}

export interface QuotaRegional {
    regional: string;
    quarter: number;
    year: number;
    quota_survey: number;
    quota_assign: number;
    quota_remaining: number;
    list_quota_witel: ListQuotaWitel[];
}

export const getQuotaRegional = (args: GetQuotaRegional): Promise<QuotaRegional> => {
    const { regional, timestamp } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/validasiPoi/v2/get-information-quota-regional`, {
                params: {
                    regional: regional?.toUpperCase(),
                    timestamp,
                },
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

export interface UpdateListQuotaWitel {
    witel: string;
    total_quota?: number;
    total_selected?: number;
}

interface UpdateQuotaRegional {
    regional: string;
    year: number;
    quarter: number;
    data: UpdateListQuotaWitel[];
}

interface UpdatedQuotaRegional {
    quota_remaining: number;
}

export const updateQuotaRegional = (body: UpdateQuotaRegional): Promise<UpdatedQuotaRegional> => {
    return new Promise((resolve, reject) => {
        axios
            .put(process.env.NEXT_PUBLIC_GSURVEY_URL + `/validasiPoi/v2/update-quota-regional`, body, {
                headers: header(),
            })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};
