import { axios, catchHelper, header, token } from "@libs/axios";

import { customFormData } from "@functions/common";

let assignmentController: AbortController;

interface GetSurveyorAssignment {
    row: number;
    page: number;
    supervisorid?: string;
    mysistaid?: string;
    userid?: string;
}

export interface SurveyorAssignment {
    id: string;
    is_active: string;
    mysistaid: number;
    status: string;
    detail: {
        account: {
            fullname: string;
        };
        mysista: {
            name: string;
            address: string;
            desa: string;
            kecamatan: string;
            kabupaten: string;
            target_household: string;
            status: string;
            status_permits?: string;
        };
    };
}

export const getSurveyorAssignment = (params: GetSurveyorAssignment): Promise<{ lists: SurveyorAssignment[]; filteredCount: number }> => {
    if (assignmentController) assignmentController.abort();
    assignmentController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/user_mysista_rel/v1/list-by-supervisor`, {
                params,
                headers: header(),
                signal: assignmentController.signal,
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

interface GetSurveyorAssignmentTregWitel extends GetSurveyorAssignment {
    row: number;
    page: number;
    supervisorid?: string;
    mysistaid?: string;
    userid?: string;
    treg?: string;
    witel?: string[];
    sourcename?: string;
    surveyid?: number;
}

export const getSurveyorAssignmentTregWitel = (
    params: GetSurveyorAssignmentTregWitel
): Promise<{ lists: SurveyorAssignment[]; filteredCount: number }> => {
    if (assignmentController) assignmentController.abort();
    assignmentController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/user_mysista_rel/v1/list-by-supervisor-tregwitel`, {
                params: { ...params, treg: params.treg?.toUpperCase(), witel: JSON.stringify(params.witel), userid: params.userid || undefined, mysistaid: params.mysistaid || undefined },
                headers: header(),
                signal: assignmentController.signal,
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

interface GetListAssignmentPermit extends GetSurveyorAssignment {
    row: number;
    page: number;
    supervisorid?: string;
    mysistaid?: string;
    userid?: string;
    region?: string;
    branch?: string;
    treg?: string;
    witel?: string;
    sourcename?: string;
    surveyid?: number;
}

export const getListAssignmentPermit = (
    params: GetListAssignmentPermit
): Promise<{ lists: SurveyorAssignment[]; filteredCount: number }> => {
    if (assignmentController) assignmentController.abort();
    assignmentController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/user_mysista_rel/v1/list-by-supervisor-tregwitel-permits`, {
                params: { ...params, treg: params.treg?.toUpperCase(), userid: params.userid || undefined, mysistaid: params.mysistaid || undefined },
                headers: header(),
                signal: assignmentController.signal,
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

export interface Polygon {
    objectid: number;
    name: string;
    address: string;
    desa: string;
    kecamatan: string;
    kabupaten: string;
    provinsi: string;
    lat: string;
    lon: string;
    surveyor: string;
    tahap_survey: number;
    area: string;
    treg: string;
    witel: string;
    telkom_treg: string;
    telkom_witel: string;
    target_household: number;
    created_user: string;
    created_date: string;
    status: string;
    geometry: string;
    attachment_pending: string;
    attachment_drop: string;
    reason_drop: string;
    reason_pending: string;
    summary?: {
        valid?: number;
        "valid-mitra"?: number;
        invalid?: number;
        unvalidated?: number;
        total_survey?: number;
    }
}

let polygonController: AbortController;
export const getPolygon = (supervisorId: string): Promise<Polygon[]> => {
    if (polygonController) polygonController.abort();
    polygonController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/user_mysista_rel/v1/active?supervisorid=${supervisorId}`, {
                headers: header(),
                signal: polygonController.signal,
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

interface AddAssignment {
    type: "default" | "kelurahan";
    surveyid: number;
    supervisorid: string;
    user_data?: string[];
    mysista_data?: {
        tahapid: number;
        sourcename: string;
        treg: string;
        witel: string;
        mysistaid: string;
    }[];
    kode_desa_dagri_data?: object;
}

export const addAssignment = (args: AddAssignment) => {
    const { type, surveyid, supervisorid, user_data, mysista_data, kode_desa_dagri_data } = args;

    const data = new FormData();
    data.append("tipe", "default");
    data.append("surveyid", String(surveyid));
    data.append("supervisorid", supervisorid);
    data.append("user_data", JSON.stringify(user_data));

    if (type === "default") {
        data.append("mysista_data", JSON.stringify(mysista_data));
    } else {
        data.append("kode_desa_dagri_data", JSON.stringify(kode_desa_dagri_data));
    }

    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_GSURVEY_URL + `/user_polygon_rel/v3/add-relation-arr`, data, {
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

export const addAssignmentPermit = (args: AddAssignment) => {
    const { type, surveyid, supervisorid, user_data, mysista_data, kode_desa_dagri_data } = args;

    const data = new FormData();
    data.append("tipe", "default");
    data.append("surveyid", String(surveyid));
    data.append("supervisorid", supervisorid);
    data.append("user_data", JSON.stringify(user_data));

    if (type === "default") {
        data.append("mysista_data", JSON.stringify(mysista_data));
    } else {
        data.append("kode_desa_dagri_data", JSON.stringify(kode_desa_dagri_data));
    }

    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_GSURVEY_URL + `/user_polygon_rel/v1/add-relation-arr-permits`, data, {
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

export const activateAssignment = (args: { assignmentId: string; status: string; type: "activate" | "deactivate" }) => {
    const { assignmentId, type, status } = args;

    const body = new FormData();
    body.append("status", status);

    return new Promise((resolve, reject) => {
        axios
            .post(
                process.env.NEXT_PUBLIC_GSURVEY_URL + `/user_polygon_rel/v2/${assignmentId}/${type}`,
                type === "activate" ? body : {},
                {
                    headers: header(),
                }
            )
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const activateAssignmentPermit = (args: { assignmentId: string; status: string; type: "activate-permits" | "deactivate-permits" }) => {
    const { assignmentId, type, status } = args;

    const body = new FormData();
    body.append("status", status);

    return new Promise((resolve, reject) => {
        axios
            .post(
                process.env.NEXT_PUBLIC_GSURVEY_URL + `/user_polygon_rel/v2/${assignmentId}/${type}`,
                type === "activate-permits" ? body : {},
                {
                    headers: header(),
                }
            )
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const activateAssignmentByPolygon = (args: { mysiistaId: number; type: "activate" | "deactivate" }) => {
    const { mysiistaId, type } = args;

    return new Promise((resolve, reject) => {
        axios
            .post(
                process.env.NEXT_PUBLIC_GSURVEY_URL + `/user_mysista_rel/v1/${type}/mysiista/${mysiistaId}`,
                {},
                {
                    headers: header(),
                }
            )
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

interface ResultGenerateToken {
    expires: number;
    ssl: boolean;
    token: string;
}

export const generateToken = (body: object): Promise<ResultGenerateToken> => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_SIIS_URL + `/api/generate-token`, body, {
                headers: header(),
            })
            .then((result) => {
                resolve(result?.data?.data);
            })
            .catch((err) => reject(err?.response?.data?.message || "Network Error"));
    });
};

interface GetDataUserMicrodemand {
    attributes: {
        address: string;
        belanja_online: string;
        berita: string;
        communication_expenses: string;
        created_at: string;
        gaming: string;
        hiburan: string;
        id: number;
        invalid_reason: null | string;
        kebutuhan_inet_bekerja: string;
        kebutuhan_sekolah: string;
        kepemilikan_rumah: string;
        latitude: number;
        longitude: number;
        media_sosial: string;
        mysiista_updated: string;
        nama_respondent: string;
        pekerjaan: string;
        phone: string;
        photo: string;
        pln_id: string;
        pln_kwh: string;
        providers: string;
        scale_of_need: string;
        source: string;
        status: string;
        subscriber_plans: string;
        surveyor_id: number;
        surveyor_treg: string;
        surveyor_witel: string;
        tahap_survey: string;
        valid_at: string;
    };
    geometry: { x: number; y: number };
}

interface ArgsDataMicrodemand {
    f: string;
    outFields: string;
    where: string;
    returnGeometry: boolean;
    rollbackOnFailure: boolean;
    geometry: string;
    geometryType: string;
    inSR: number;
    outSR: number;
    resultRecordCount: number;
    token: string;
}

export const getDataMicrodemand = (args: ArgsDataMicrodemand): Promise<GetDataUserMicrodemand[]> => {
    const body = customFormData(args);
    return new Promise((resolve, reject) => {
        axios
            .post("https://gis.udata.id/gis/rest/services/SIIS_3_0/Microdemand_SIIS/MapServer/0/query", body)
            .then((result) => {
                resolve(result?.data?.features);
            })
            .catch((err) => reject(err?.response?.data?.message || "Network Error"));
    });
};

interface GetDataPolygons {
    attributes: {
        address: string;
        created_date: number;
        created_user: string;
        desa: string;
        id_desa: string;
        kabupaten: string;
        kecamatan: string;
        keterangan: string;
        last_edited_date: number;
        last_edited_user: string;
        lat: string;
        lon: string;
        name: string;
        objectid: number;
        postal: number;
        prioritas: number;
        provinsi: string;
        street: string;
        surveyor: string;
        tahap_survey: number;
        target_household: number;
        treg: string;
        witel: string;
    };
    geometry: {
        rings: [][];
    };
}

export const getPolygonMicrodemand = (params: ArgsDataMicrodemand): Promise<GetDataPolygons[]> => {
    const body = customFormData(params);
    return new Promise((resolve, reject) => {
        axios
            .post("https://gis.udata.id/gis/rest/services/Survey_Microdemand/Polygon_Microdemand/FeatureServer/0/query", body)
            .then((result) => {
                resolve(result?.data?.features);
            })
            .catch((err) => reject(err?.response?.data?.message || "Network Error"));
    });
};

export const getPredicCountBulding = (args: { polygon: string }): Promise<{ count: string }[]> => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_SIIS_URL + `/api/jumlah-building-by-polygon`, args, {
                headers: header(),
            })
            .then((result) => {
                resolve(result?.data.data || []);
            })
            .catch((err) => reject(err?.response?.data?.message || "Network Error"));
    });
};

interface GetInfoBatas {
    kecamatan: string;
    kelurahan: string;
    kode_desa_dagri: string;
    kota: string;
    provinsi: string;
    treg: string;
    witel: string;
}

export const getInfoBatasAdministratif = (args: { lat: number; long: number }): Promise<GetInfoBatas> => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_SIIS_URL + `/api/kelurahan-dagri`, args, {
                headers: header(),
            })
            .then((result) => {
                resolve(result?.data.data[0]);
            })
            .catch((err) => reject(err?.response?.data?.message || "Network Error"));
    });
};

export const addPolygon = (body: FormData) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_MYSIISTA_URL + `/polygon/addPolygon`, body, {
                headers: { Authorization: `Bearer ${token()}` },
            })
            .then((result) => {
                resolve(result?.data?.data || []);
            })
            .catch((err) => reject(err?.response?.data?.message || "Network Error"));
    });
};

// microdemand tsel
export interface GetPolygonTselProps {
    page: number;
    row: number;
    area?: string;
    treg?: string;
    witel?: string;
    status?: string;
    vendor?: string;
    search?: string;
}

let polygonTselController: AbortController;
export const getPolygonTsel = (params : GetPolygonTselProps): Promise<{ data: Polygon[], totalData: number }> => {
    if (polygonTselController) polygonTselController.abort();
    polygonTselController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/mysiista/v1/list-polygon-tsel`, {
                params,
                headers: header(),
                signal: polygonTselController.signal,
                cache: false,
            })
            .then((response) => {
                resolve({
                    data: response.data.data,
                    totalData: response.data.meta?.totalData || 0,
                });
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export interface CountPolygonStatus {
    draft: number;
    cpp_approved: number;
    cpp_rejected: number;
    approved: number;
    rejected: number;
    assigned: number;
    permit_rejected: number;
    permit_process: number;
    permit_approved: number;
    finished_survey: number;
    done: number;
    pending?: number;
}


let polygonCountController: AbortController;
export const getPolygonCount = (params : {
    area?: string;
    region?: string;
    branch?: string;
    vendor?: string;
}): Promise<{ result: CountPolygonStatus, totalData: number }> => {
    if (polygonCountController) polygonCountController.abort();
    polygonCountController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_GSURVEY_URL + `/dashboard/v1/count-polygon-per-status`, {
                params,
                headers: header(),
                signal: polygonCountController.signal,
                cache: false,
            })
            .then((response) => {
                resolve({
                    result: response.data.data?.result,
                    totalData: response.data.data?.totalData || 0,
                });
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const storeApprovalPolygon = (args: { 
    id: number; 
    status: "approved" | "assigned" | "finished-survey" | "done" | "pending" | "drop" | "permits-process" | "permits-approved" | "permits-rejected";
    reason?: string;
}) => {
    
    return new Promise((resolve, reject) => {
        axios
            .post(
                process.env.NEXT_PUBLIC_GSURVEY_URL + `/mysiista/v1/update-status-polygon`,
                args,
                {
                    headers: header(),
                }
            )
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const updateStatusPermit = (args: { 
    mysistaid: number; 
    status_permits: "approved" | "process" | "rejected";
    reason_permits?: string;
}) => {
    
    return new Promise((resolve, reject) => {
        axios
            .post(
                process.env.NEXT_PUBLIC_GSURVEY_URL + `/dashboardPermits/v1/update-status-polygon-permits`,
                args,
                {
                    headers: header(),
                }
            )
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const uploadBakStatusPolygon = (body: {
    polygonId: number;
    status: "pending" | "drop";
    reason: string;
    file: File;
}) => {
    const { polygonId, status, reason, file } = body;

    const formData = new FormData();
    formData.append("polygonId", polygonId.toString());
    formData.append("status", status);
    formData.append("reason", reason);
    formData.append("file", file);
    
    return new Promise((resolve, reject) => {
        axios
            .post(
                process.env.NEXT_PUBLIC_GSURVEY_URL + `/dashboard/v1/upload-document-status-polygon`,
                formData,
                {
                    headers: header(),
                }
            )
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const storeToDesign = (params: { cluster_id: number }) => {

    const body = new FormData();
    body.append("cluster_id", params.cluster_id.toString());
    
    return new Promise((resolve, reject) => {
        axios
            .post(
                process.env.NEXT_PUBLIC_GSURVEY_URL + `/iHLD/v1/polygon-microdemand`,
                body,
                {
                    headers: header(),
                }
            )
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const exportPolygonKml = (body: {
    area: string;
    region?: string;
    branch?: string;
    vendor?: string;
    status?: string;
}) => {
    
    return new Promise((resolve, reject) => {
        axios
            .post(
                process.env.NEXT_PUBLIC_GSURVEY_URL + `/dashboard/v1/download-kml-polygon-per-status`,
                body,
                {
                    headers: header(),
                }
            )
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const deletePolygon = (body: {
    id: number;
}) => {
    
    return new Promise((resolve, reject) => {
        axios
            .post(
                process.env.NEXT_PUBLIC_GSURVEY_URL + `/mysiista/v1/delete-polygon`,
                body,
                {
                    headers: header(),
                }
            )
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const updateStatusPolygons = (body: {
    id: string[];
    status: string;
}) => {
    
    return new Promise((resolve, reject) => {
        axios
            .post(
                process.env.NEXT_PUBLIC_GSURVEY_URL + `/mysiista/v1/update-status-polygon-arr`,
                body,
                {
                    headers: header(),
                }
            )
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const storePolygon = (body: {
    name: string;
    target_household: number;
    surveyor: string;
    geometry: string;
}) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                process.env.NEXT_PUBLIC_GSURVEY_URL + `/dashboard/v1/insert-polygon-microdemand`,
                body,
                {
                    headers: header(),
                }
            )
            .then((response) => {
                resolve(response.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const getStatusAssignmentPolygon = (args: {
    id: number;
}): Promise<{ result: boolean }> => {
    return new Promise((resolve, reject) => {
        axios
            .get(
                process.env.NEXT_PUBLIC_GSURVEY_URL + `/dashboard/v1/check-assignment?polygon_id=${args.id}`,
                {
                    headers: header(),
                    cache: false,
                }
            )
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};