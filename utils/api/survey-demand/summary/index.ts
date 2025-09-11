import { axios, catchHelper, header } from "@libs/axios";
import { SurveyCount } from "../respondent";

interface GetSummary {
    surveyid: number;
    periode_start: string;
    periode_end: string;
    area?: string;
    region?: string;
}

export interface Summary {
    area: string;
    treg: string;
    witel: string;
    submit: number;
    realisasi: number;
}

export const getSummary = (params: GetSummary): Promise<Summary[]> => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/targets/v2/summary/area`, {
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

interface AssignmentPolygon {
    done: number;
    not_yet: number;
    total: number;
}

interface PermitPolygon {
    not_yet: number;
    yes: number;
    process: number;
    no: number;
    total: number;
}

interface TotalSurveyPolygon {
    low: number;
    medium: number;
    high: number;
    finish: number;
    pending: number;
    drop: number;
    design: number;
    total: number;
}

interface TotalPolygonPermit {
    waiting: number;
}

interface SurveySummary {
    unvalidated: number;
    valid_mitra: number;
    valid: number;
    invalid: number;
    total: number;
}

interface achievement{
    target_household: number;
    progress: number;
}

export interface GetSummaryDetail {
    type?: string;
    area: string;
    region: string;
    branch: string;
    assignment_polygon: AssignmentPolygon;
    permit_polygon: PermitPolygon;
    total_survey_polygon: TotalSurveyPolygon;
    total_polygon_permits: TotalPolygonPermit;
    total_survey: SurveySummary;
    achievement_all: achievement;
    achievement_assign: achievement;
}

export const getSummaryDetail = (params: {
    area: string;
    region?: string;
    branch?: string;
    vendor?: string;
}): Promise<GetSummaryDetail[]> => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/dashboard/v1/summary`, {
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

interface PermitStatistics {
    ogp_survey: number;
    done: number;
}

export interface SummaryPemitsData {
    type?: string;
    regional: string;
    witel: string;
    drop_pending?: number;
    permits_approved: PermitStatistics;
    permits_process: PermitStatistics;
    permits_rejected: PermitStatistics;
    permits_not_yet: PermitStatistics;
    ihld_sent: {
        done: number;
    }
}

export const getSummaryDashboardPemits = (params: {
    regional: string;
    witel?: string;
}): Promise<SummaryPemitsData[]> => {
    const { regional, witel } = params;
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/dashboardPermits/v1/summary-permits`, {
                params: { regional: regional.toUpperCase(), witel },
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


export const getSummaryPolygon = (args: { 
    row: number;
    page: number;
    area?: string, 
    region?: string, 
    branch?: string, 
    vendor?: string,
    status?:string,
    status_permits?:string,
    search?: string,
}): Promise<{lists: SurveyCount[], totalData: number}> => {
    
    if (args.vendor === "") delete args.vendor;
    if (args.search === "") delete args.search;

    // /dashboard/v1/summary-polygon?witel=PALEMBANG&vendor=telkomakses&start_date=2024-07-01&end_date=2024-07-31
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/dashboard/v1/summary-polygon`, {
                params: args,
                headers: header(),
                cache: false,
            })
            .then((response) => {
                resolve({
                    lists: response.data.data,
                    totalData: response.data.meta?.totalData ?? 0
                });
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const getSummaryPolygonPermit = (args: { 
    row: number;
    page: number;
    regional?: string, 
    witel?: string,
    status?:string,
    status_permits?:string,
    search?: string,
}): Promise<{lists: SurveyCount[], totalData: number}> => {
    
    if (args.search === "") delete args.search;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/dashboardPermits/v1/summary-polygon-permits`, {
                params: args,
                headers: header(),
                cache: false,
            })
            .then((response) => {
                resolve({
                    lists: response.data.data,
                    totalData: response.data.meta?.totalData ?? 0
                });
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const exportSummaryPolygon = (body: { 
    area?: string, 
    region?: string, 
    branch?: string, 
    vendor?: string
    status?: string
}): Promise<BlobPart> => {
    
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_GSURVEY_URL + `/dashboard/v1/download-summary-polygon`, body, {
                headers: header(),
                cache: false,
                responseType: 'arraybuffer',
            })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const exportSummaryPolygonPermit = (body: { 
    area?: string, 
    region?: string, 
    branch?: string, 
    vendor?: string
    status?: string
}): Promise<BlobPart> => {

    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_GSURVEY_URL + `/dashboardPermits/v1/download-summary-polygon-permits`, body, {
                headers: header(),
                cache: false,
                responseType: 'arraybuffer',
            })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const exportSummaryActivity = (): Promise<BlobPart> => {
    
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/dashboard/v1/download-list-cluster-per-surveyor`, {
                headers: header(),
                cache: false,
                responseType: 'arraybuffer',
            })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const exportListInvalid = (): Promise<BlobPart> => {
    
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/dashboard/v1/download-list-respondent-invalid`, {
                headers: header(),
                cache: false,
                responseType: 'arraybuffer',
            })
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

