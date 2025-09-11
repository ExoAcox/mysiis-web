import { axios, header, catchHelper } from "@libs/axios";

import { titleCase } from "@functions/common";

let competitorController: AbortController;

export interface GetAllCompetitor {
    page: number;
    row: number;
    regional?: string | null;
    witel?: string | null;
    match?: string | null;
    id?: string | null;
}

export interface ListAllCompetitor {
    device_id: number;
    devicename: string;
    regional: string;
    stoname: string;
    status_occ: string;
    witel: string;
    latency_competitor_avg_ms: number;
    latency_competitor_min_ms: number;
    latency_telkom_avg_ms: number;
    latency_telkom_max_ms: number;
    latency_telkom_min_ms: number;
    overall_match: string;
    provider: string;
    competitor_speed: number;
    competitor_price: number;
    telkom_pkg_speed_flag: string;
    telkom_pkg_speed_internet_price: number;
    competitor_count_diff: number;
    competitor_latency_diff: number;
    competitor_price_diff: number;
    lat: number;
    long: number;
}

export interface AllCompetitor {
    data: ListAllCompetitor[];
    meta: { all_data: number, max_page: number };
}

export const getAllCompetitor = (args: GetAllCompetitor): Promise<AllCompetitor> => {
    competitorController?.abort();
    competitorController = new AbortController();

    const { page = 1, row = 10, regional = null, witel = null, match = null, id = null } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_ODP_URL + "/odp/v1/competitors", {
                params: {
                    page,
                    row,
                    regional,
                    witel,
                    overall_match: match,
                    device_id: id,
                },
                headers: header(),
                signal: competitorController.signal,
            })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const cancelGetAllCompetitor = () => {
    competitorController?.abort();
};

export const getRegionalCompetitor = (): Promise<{ regional: string }[]> => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_ODP_URL + `/odp/v1/competitors/regional`, {
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

export interface GetCompetitorSummary {
    regional?: string | null;
}

interface ListCompetitorSummary {
    regional: string;
    witel: string;
    wins: number;
    losses: number;
    no_competitor: number;
    total: number;
}

interface CompetitorSummary {
    data: ListCompetitorSummary[];
}

export const getCompetitorSummary = (args: GetCompetitorSummary): Promise<CompetitorSummary> => {
    const { regional = null } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_ODP_URL + `/odp/v1/competitors/statistic`, {
                params: { regional: regional && titleCase(regional) },
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

interface ListSummaryByRegional {
    regional: string;
    witel: string;
    wins: number;
    losses: number;
    no_competitor: number;
    total: number;
}

interface SummaryByRegional {
    data: ListSummaryByRegional[];
}

export const getSummaryByRegional = (): Promise<SummaryByRegional> => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_ODP_URL + `/odp/v1/competitors/statistic/regional`, {
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

export interface GetWitelCompetitor {
    regional?: string;
}

export const getWitelCompetitor = (args: GetWitelCompetitor): Promise<{ witel: string }[]> => {
    const { regional = null } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_ODP_URL + `/odp/v1/competitors/regional/witel`, {
                params: { regional: regional && titleCase(regional) },
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
