import { StaticImageData } from "next/image";

import { axios, catchHelper, header } from "@libs/axios";

import { User } from "@api/account/user";

let respondentController: AbortController;

export interface GetRespondentByValid {
    row: number;
    page?: number;
    keyword?: string | null;
    treg?: string;
    witel?: string;
    periode_start?: string;
    periode_end?: string;
    arr_conf_subscriber_plansid?: string[];
    arr_conf_scale_of_needid?: string[];
    is_only_odp_ready?: boolean;
    is_return_count?: boolean;
    is_simple?: boolean;
    is_return_metadata?: boolean;
}

export interface Respondent {
    id: number;
    latitude: string;
    longitude: string;
    conf_scale_of_needid: number;
    name?: string;
    phone?: string;
    address?: string;
    treg?: string;
    status?: string;
    sourcename?: string;
    lat_long_treg?: string;
    lat_long_witel?: string;
    witel?: string;
    conf_scale_of_need_value?: string;
    conf_subscribe_plans_value?: string;
    count_odp_ready?: string;
    survey_at?: string;
    created_at?: string;
    valid_at?: string;
    photo?: string | StaticImageData;
    conf_kepemilikan_rumah_value?: string;
    conf_pekerjaan_value?: string;
    conf_communication_expenses_value?: string;
    conf_providers_value?: string;
    conf_pln_kwhid?: number;
    conf_pln_kwh_value?: string;
    keterangan?: string;
    pln_id?: string;
    invalid_reason?: string;
    valid_reason?: string;
    valid_reason_mitra?: string;
    user?: User;
    survey_by_user?: User;
    survey_by?: string;
    priority?: string;
    updated_at?: string;
    mysista_data?: { 
        objectid: number; 
        name: string; 
        dokumen_bakp: string
        status: string;
        lat: string; 
        lon: string; 
        wkt: string;
        status_permits?: string;
    };
    telkom_treg?: string;
    telkom_witel?: string; 
    unsc_alamat?: string;
    unsc_id_sc?: string;
    unsc_k_contact?: string;
    unsc_latitude?: string;
    unsc_longitude?: string;
    unsc_nama?: string;
    unsc_ncli?: string;
    unsc_no_hp?: string;
    unsc_paket?: string;
    unsc_status?: string;
    primary_answer?: string;
    secondary_answer?: string;
    permits_fee?: number;
}

export const getRespondentByValid = (args: GetRespondentByValid): Promise<{ lists: Respondent[]; filteredCount: number }> => {
    respondentController?.abort();
    respondentController = new AbortController();

    const {
        row,
        page,
        keyword,
        periode_start,
        periode_end,
        treg,
        witel,
        arr_conf_subscriber_plansid,
        arr_conf_scale_of_needid,
        is_only_odp_ready,
        is_simple,
        is_return_count = true,
        is_return_metadata = false,
    } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + "/respondents/v1/list-by-valid", {
                params: {
                    row,
                    page,
                    keyword,
                    periode_start,
                    periode_end,
                    treg: treg?.toUpperCase(),
                    witel,
                    arr_conf_subscriber_plansid: JSON.stringify(arr_conf_subscriber_plansid),
                    arr_conf_scale_of_needid: JSON.stringify(arr_conf_scale_of_needid),
                    is_only_odp_ready,
                    is_return_count,
                    is_simple,
                    is_return_metadata,
                },
                headers: header(),
                signal: respondentController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export interface GetRespondentByWitel {
    survey_at_start?: string;
    survey_at_end?: string;
    treg?: string;
    page?: number;
    status?: string;
}

export interface RespondentByWitel {
    treg?: string;
    witel?: string;
    periode_date?: string;
    status?: string;
    total?: string | number | null;
}

export const getRespondentByWitel = (args: GetRespondentByWitel): Promise<{ items: RespondentByWitel[]; witel: string }[]> => {
    respondentController?.abort();
    respondentController = new AbortController();

    const { survey_at_start, survey_at_end, treg, status = "valid" } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + "/respondents/v1/summary-by-witel/date", {
                params: {
                    status,
                    survey_at_start,
                    survey_at_end,
                    treg: treg?.toUpperCase(),
                },
                headers: header(),
                signal: respondentController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

interface SummaryRespondent {
    unvalidated: number;
    'valid-mitra': number;
    valid: number;
    invalid: number;
}

interface GetRespondentByRegAndPolygon {
    row?: number;
    page?: number;
    survey_at_start?: string;
    survey_at_end?: string;
    surveyid?: string;
    treg?: string;
    witel?: string | string[];
    telkom_treg?: string;
    telkom_witel?: string;
    status?: string;
    status_permits?: string;
    search?: string;
    name?: string;
    phone?: string;
    mysistaid?: number;
    userid?: string[];
    supervisor?: string;
    sourcename?: string;
    survey_by?: string;
}

export const getRespondentByRegAndPolygon = (args: GetRespondentByRegAndPolygon): Promise<{ lists: Respondent[]; filteredCount: number; summary: SummaryRespondent }> => {
    respondentController?.abort();
    respondentController = new AbortController();

    const { row, page, surveyid, treg, witel, status, name, phone, mysistaid, userid, supervisor, sourcename, survey_at_start, survey_at_end } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/respondents/v2/list-by-reg-and-polygon-arr`, {
                params: {
                    row,
                    page,
                    surveyid,
                    treg: treg?.toUpperCase(),
                    witel: JSON.stringify(witel),
                    status,
                    name,
                    phone,
                    userid: userid ? JSON.stringify(userid) : undefined,
                    mysistaid: mysistaid,
                    supervisor,
                    sourcename,
                    updated_at_start: survey_at_start,
                    updated_at_end: survey_at_end,
                },
                headers: header(),
                signal: respondentController.signal,
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

interface GetRespondentByRegAndPolygonPermit {
    row: number;
    page: number;
    survey_at_start: string;
    survey_at_end: string;
    surveyid?: string;
    treg?: string;
    witel?: string;
    telkom_treg?: string;
    telkom_witel?: string;
    status?: string;
    status_permits?: string;
    search?: string;
    name?: string;
    phone?: string;
    mysistaid?: number;
    userid?: string[];
    supervisor?: string;
    sourcename?: string;
    survey_by?: string;
}

export const getRespondentPermitsByRegAndPolygon = (args: GetRespondentByRegAndPolygonPermit): Promise<{ lists: Respondent[]; filteredCount: number; summary: SummaryRespondent }> => {
    respondentController?.abort();
    respondentController = new AbortController();

    console.log("args", args);
    
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/respondents/v1/permit-respondent`, {
                params: args,
                headers: header(),
                signal: respondentController.signal,
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

export type ValidateStatus = "valid" | "valid-mitra" | "unvalidated" | "invalid" | "proses-izin";
interface ValidateRespondent {
    surveyId: number;
    status: ValidateStatus;
    prioritas?: string;
    invalid_reason?: string;
    valid_reason?: string;
    process_reason?: string;
    valid_reason_mitra?: string;
}

export const validateRespondent = (args: ValidateRespondent) => {
    const { surveyId, status, prioritas, invalid_reason, valid_reason, valid_reason_mitra } = args;

    const formData = new FormData();
    formData.append("status", status);

    if (prioritas) formData.append("priority", prioritas);
    if (valid_reason) formData.append("valid_reason", valid_reason);
    if (valid_reason_mitra) formData.append("valid_reason_mitra", valid_reason_mitra);
    if (invalid_reason) formData.append("invalid_reason", invalid_reason);

    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_GSURVEY_URL + `/respondents/v2/${surveyId}/validate`, formData, {
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

interface ValidatePermit {
    polygonId: number;
    file_bakp?: File;
    vendor?: string;
    reason_permits?: string;
    permits_fee?: number;
}

export const validatePermit = (args: ValidatePermit) => {
    const { polygonId, vendor, file_bakp, } = args;

    const formData = new FormData();
    formData.append("polygonId", polygonId.toString());
    formData.append("vendor", vendor!);
    formData.append("file", file_bakp!);
    formData.append("reason_permits", args.reason_permits!);
    if (args.permits_fee) formData.append("permits_fee", args.permits_fee.toString());

    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_GSURVEY_URL + `/dashboard/v1/upload-bakp`, formData, {
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

export interface ResponseGroups {
    id: number;
    label: string;
    responses: {
        id: string;
        respondentid: number;
        questionid: number;
        question_type: string;
        question_label: string;
        value: string;
    }[]
}
export interface RespondentWithResponse {
    responses: {
        lists: {
            id: number;
            section: string;
            groups: ResponseGroups[];
        }[];
    };
    latitude?: string;
    longitude?: string;
    invalid_reason?: string;
}

let getRespondentWithResponseController: AbortController;
export const getRespondentWithResponse = (surveyId: number): Promise<RespondentWithResponse> => {
    getRespondentWithResponseController?.abort();
    getRespondentWithResponseController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/respondents/v2/${surveyId}/with-response`, {
                headers: header(),
                signal: getRespondentWithResponseController.signal,
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

interface GetSurvey {
    treg: string;
    witel: string;
    sourcename: string;
    supervisorid: string;
    survey_at_start: string;
    survey_at_end: string;
    surveyid: string;
}

export const getSurvey = (args: GetSurvey) => {
    const { treg, witel, sourcename, supervisorid, survey_at_start, survey_at_end, surveyid } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/respondents/v2/export-by-reg-and-polygon`, {
                params: { treg, witel, sourcename, supervisorid, survey_at_start, survey_at_end, surveyid },
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

export const getSurveyDetail = (args: GetSurvey) => {
    const { treg, witel, sourcename, supervisorid, survey_at_start, survey_at_end, surveyid } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/respondents/v2/export-by-reg-and-polygon-detail`, {
                params: { treg, witel, sourcename, supervisorid, survey_at_start, survey_at_end, surveyid },
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

interface GetSurveyCount extends GetSurvey {
    status_polygon?: string;
    status: string;
    page: number;
    row: number;
}

export interface LogStatus {
    id: number;
    id_polygon: number;
    surveyor: string;
    userid: string;
    context: string;
    value: string;
    date: string;
}

export interface SurveyCount {
    respondent: {
        invalid: number;
        unvalidated: string;
        valid: string;
        valid_mitra: number;
    };
    user: {
        userId: string;
        fullname: string;
        customdata: {
            vendor: string;
        };
    };
    supervisor: {
        email: string;
        fullname: string;
        mobile: string;
        userId: string;
    };
    polygon?: {
        name?: string;
        area?: string;
        treg?: string;
        witel?: string;
        telkom_regional?: string;
        telkom_witel?: string;
        surveyor?: string;
        target_household?: number;
        objectid?: number;
        status?: string;
        status_permits?: string;
        dokumen_bakp?: string;
        ihld_sent?: string;
    };
    priority?: {
        mysistaid?: number;
        high?: number;
        medium?: number;
        low?: number;
        not_priority?: number;
    }
    treg: string;
    witel: string;
    status?: string;
    is_ready_design?: boolean;
    log_status?: LogStatus[];
    user_last_survey: string,
    date_last_survey: string,
}

export const getSurveyCount = (args: GetSurveyCount): Promise<SurveyCount[]> => {
    const { status, treg, witel, sourcename, supervisorid, survey_at_start, survey_at_end, surveyid, status_polygon } = args;

    const params: { 
        treg: string; 
        witel: string; 
        sourcename: string; 
        supervisorid: string; 
        updated_at_start: string; 
        updated_at_end: string; 
        surveyid: string; 
        status?: string 
    } = { treg, witel, sourcename, supervisorid, updated_at_start: survey_at_start, updated_at_end: survey_at_end, surveyid };
   
    if(status === "polygon" && status_polygon) {
        params.status = status_polygon;
    }

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/respondents/v2/count-by-${status}`, {
                params: params,
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

interface GetSurveyCountWitelArgs {
    treg: string;
    surveyid: string;
    type: string;
    survey_at_start: string;
    survey_at_end: string;
}

export interface GetSurveyCountWitel {
    [key: string]: {
        invalid: string;
        "invalid-mitra": number;
        unvalidated: string;
        valid: string;
        "valid-mitra": number;
    };
}

export const getSurveyCountWitel = (args: GetSurveyCountWitelArgs): Promise<GetSurveyCountWitel> => {
    const { type, treg, survey_at_start, survey_at_end, surveyid } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/respondents/v2/summary-by-regional`, {
                params: { treg, type, surveyid, survey_at_start, survey_at_end },
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


export interface ResponsesPerSurvey {
    questionid: number;
    question_text: string;
    value: string;
}

interface PreSurvey {
    respondentid: number;
    responses: ResponsesPerSurvey[];
}
export const getPreSurveyByPolygon = (params: { polygon_id: number }): Promise<PreSurvey[]> => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/responses/v2/get-presurvey-by-polygon-id`, {
                params: { polygon_id: params.polygon_id },
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

export interface GetSurveyCountByUser {
    cluster: string;
    surveyor: string;
    last_survey_created: string;
    valid: number;
    "valid-mitra": number;
    invalid: number;
    unvalidated: number;
    total_survey: number;
}

export const getSummaryPolygonByUser = (args: { userid: string }): Promise<GetSurveyCountByUser[]> => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/dashboard/v1/list-cluster-per-surveyor`, {
                params: args,
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

export interface paramsExportListRespondent {
    area?: string;
    region?: string;
    branch?: string;
    vendor?: string;
    valid_at_start?: string;
    valid_at_end?: string;
}

export const exportListRespondent = (payload: paramsExportListRespondent): Promise<BlobPart> => {    
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_GSURVEY_URL + `/dashboard/v1/download-respondent`, payload, {
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