import { axios, catchHelper, token } from "@libs/axios";

export interface GetMyIhxAddressTranslate {
    regional: string;
    witel: string;
    date: string;
    nextDate: string;
    row: number;
    show_detail: boolean;
    show_mask: boolean;
}

export interface MyIhxAddress {
    id: number;
    lat: number;
    long: number;
    mobile: number;
    email: string;
}

let myIhxAddressController: AbortController;
export const getMyIhxAddressTranslate = (
    args: GetMyIhxAddressTranslate,
    pageArg: number
): Promise<{ lists: MyIhxAddress[]; totalCount: number; filteredCount: number }> => {
    if (myIhxAddressController) myIhxAddressController.abort();
    myIhxAddressController = new AbortController();

    const { regional, witel, date, nextDate, row = 1000, show_detail = false, show_mask = true } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_INDIHOME_URL + `/api/myihx_event/v1/myihx_address_translate`, {
                params: {
                    row,
                    page: pageArg,
                    regional,
                    witel,
                    created_at_start: date,
                    created_at_end: nextDate,
                    show_detail,
                    show_mask,
                },
                headers: { Authorization: `Bearer ${token()}` },
                signal: myIhxAddressController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

interface MyIhxAddressDetail {
    mysiis_st_name: string;
    mysiis_kelurahan: string;
    mysiis_kecamatan: string;
    mysiis_kota: string;
    mysiis_provinsi: string;
}

let myIhxAddressDetailController: AbortController;
export const getMyIhxAddressTranslateDetail = (id: number): Promise<MyIhxAddressDetail> => {
    if (myIhxAddressDetailController) myIhxAddressDetailController.abort();
    myIhxAddressDetailController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_INDIHOME_URL + `/api/myihx_event/v1/myihx_address_translate/${id}`, {
                headers: { Authorization: `Bearer ${token()}` },
                signal: myIhxAddressDetailController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};
interface GetMyIhxFunnel {
    date: string;
    nextDate: string;
    regional: string;
    witel: string;
}

export type FunnelData = { positive: string; negative: string };
export interface MyIhxFunnel {
    [x: string]: FunnelData;
    callback_revoke_order: FunnelData;
    callback_technician_installation: FunnelData;
    callback_update_assignment_status: FunnelData;
    callback_update_kyc: FunnelData;
    event_package_subscription: FunnelData;
    event_service_feasibility: FunnelData;
    event_user_kyc: FunnelData;
    event_user_confirm_order: FunnelData;
}

let myIhxFunnelController: AbortController;
export const getMyIhxFunnel = (args: GetMyIhxFunnel): Promise<MyIhxFunnel> => {
    if (myIhxFunnelController) myIhxFunnelController.abort();
    myIhxFunnelController = new AbortController();

    const { date, nextDate, regional, witel } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_INDIHOME_URL + `/api/myihx_funnel/v1/psb`, {
                params: {
                    start_date: date,
                    end_date: nextDate,
                    regional,
                    witel,
                },
                headers: { Authorization: `Bearer ${token()}` },
                signal: myIhxFunnelController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

let myIhxFunnelRawController: AbortController;
export const getMyIhxFunnelRaw = (args: GetMyIhxFunnel): Promise<MyIhxFunnel> => {
    if (myIhxFunnelRawController) myIhxFunnelRawController.abort();
    myIhxFunnelRawController = new AbortController();

    const { date, nextDate, regional, witel } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_INDIHOME_URL + `/api/myihx_funnel/v1/psb/raw`, {
                params: {
                    start_date: date,
                    end_date: nextDate,
                    regional,
                    witel,
                },
                headers: { Authorization: `Bearer ${token()}` },
                signal: myIhxFunnelRawController.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export interface MyIhxFunnelV2 {
    feasibility: {
        _total: number;
        pt1: number;
        pt2: number;
        pt3: number;
        nopackage: number;
    };
    feasibility_pt1_pt2_not_kyc: number;
    kyc: {
        _total: number;
        valid: number;
        invalid: number;
        notresponding: number;
        duplicated: number;
        inprogress: number;
    };
    kyc_valid_not_contract: number;
    contract: number;
    contract_not_confirm_order: number;
    confirm_order: number;
    confirm_order_not_manja: number;
    manja: {
        _total: number;
        berhasil: number;
        inprogress: number;
        onhold: number;
        cancel: number;
        reschedule: number;
        gagal: number;
    };
    pembayaran: {
        _total: number;
        completed: number;
        isolir: number;
        payable: number;
        paid: number;
        unisolir: number;
        success: number;
    };
}

let myIhxFunnelV2Controller: AbortController;
export const getMyIhxFunnelV2 = (args: GetMyIhxFunnel): Promise<MyIhxFunnelV2> => {
    if (myIhxFunnelV2Controller) myIhxFunnelV2Controller.abort();
    myIhxFunnelV2Controller = new AbortController();

    const { date, nextDate, regional, witel } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_INDIHOME_URL + `/api/myihx_funnel/v1/psb/v2`, {
                params: {
                    start_date: date,
                    end_date: nextDate,
                    regional,
                    witel,
                },
                headers: { Authorization: `Bearer ${token()}` },
                signal: myIhxFunnelV2Controller.signal,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

interface GetMyIhxFunnelDetail {
    step: string;
    state?: string;
    date: string;
    nextDate: string;
    page: number;
    row: number;
    regional?: string;
    witel?: string;
    trackid?: string;
}
export interface MyIhxFunnelDetail {
    id: string;
    status: string;
    created_at: string;
    regional: string;
    witel: string;
    nd: string;
    trackid: string;
    userid: string;
    idtype: string;
    idnum: string;
    email: string;
    mobile: number;
    invalidreason: string;
    action: string;
    reason: string;
    state: string;
    step: string;
    sto: string;
    odp_deviceid: string;
}

export interface MyIhxFunnelDetailData {
    countTotal: number;
    lists: MyIhxFunnelDetail[];
    state: string;
    step: string;
}

let myIhxFunnelDetailController: AbortController;
export const getMyIhxFunnelDetail = (
    args: GetMyIhxFunnelDetail
): Promise<{ lists: MyIhxFunnelDetail[]; countTotal: number; state: string; step: string }> => {
    if (myIhxFunnelDetailController) myIhxFunnelDetailController.abort();
    myIhxFunnelDetailController = new AbortController();

    const { step, state, date, nextDate, page = 1, row = 10, regional, witel, trackid } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_INDIHOME_URL + `/api/myihx_funnel/v1/psb/detail`, {
                params: {
                    page,
                    row,
                    step,
                    state,
                    start_date: date,
                    end_date: nextDate,
                    regional,
                    witel,
                    trackid,
                },
                headers: { Authorization: `Bearer ${token()}` },
                signal: myIhxFunnelDetailController.signal,
            })
            .then((response) => {
                resolve({ ...response.data.data, step, state });
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

let myIhxFunnelDetailRawController: AbortController;
export const getMyIhxFunnelDetailRaw = (
    args: GetMyIhxFunnelDetail
): Promise<{ lists: MyIhxFunnelDetail[]; countTotal: number; state: string; step: string }> => {
    if (myIhxFunnelDetailRawController) myIhxFunnelDetailRawController.abort();
    myIhxFunnelDetailRawController = new AbortController();

    const { step, state, date, nextDate, page = 1, row = 10, regional = "", witel = "", trackid } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_INDIHOME_URL + `/api/myihx_funnel/v1/psb/raw/detail`, {
                params: {
                    page,
                    row,
                    step,
                    state,
                    start_date: date,
                    end_date: nextDate,
                    regional,
                    witel,
                    trackid,
                },
                headers: { Authorization: `Bearer ${token()}` },
                signal: myIhxFunnelDetailRawController.signal,
            })
            .then((response) => {
                resolve({ ...response.data.data, step, state });
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export interface MyIhxFunnelV2Detail {
    id: string;
    nd: string;
    regional: string;
    witel: string;
    created_at: string;
    trackid: string;
    lat: number;
    long: number;
    userid: string;
    email: string;
    mobile: number;
    status: string;
    sto: string;
    odp_deviceid: string;
}

let myIhxFunnelV2DetailController: AbortController;
export const getMyIhxFunnelV2Detail = (
    args: GetMyIhxFunnelDetail
): Promise<{ lists: MyIhxFunnelV2Detail[]; countTotal: number; state: string; step: string }> => {
    if (myIhxFunnelV2DetailController) myIhxFunnelV2DetailController.abort();
    myIhxFunnelV2DetailController = new AbortController();

    const { step, state, date, nextDate, page = 1, row = 10, regional, witel, trackid } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_INDIHOME_URL + `/api/myihx_funnel/v1/psb/v2/detail`, {
                params: {
                    page,
                    row,
                    step,
                    state,
                    start_date: date,
                    end_date: nextDate,
                    regional,
                    witel,
                    trackid,
                },
                headers: { Authorization: `Bearer ${token()}` },
                signal: myIhxFunnelV2DetailController.signal,
            })
            .then((response) => {
                resolve({ ...response.data.data, step, state });
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

let trackidDetailController: AbortController;

export const getTrackidDetail = (args: GetMyIhxFunnelDetail): Promise<MyIhxFunnelDetailData> => {
    if (trackidDetailController) trackidDetailController.abort();
    trackidDetailController = new AbortController();

    const { date, nextDate, trackid } = args;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_INDIHOME_URL + `/api/myihx_funnel/v1/psb`, {
                params: {
                    start_date: date,
                    end_date: nextDate,
                    trackid: trackid,
                },
                headers: { Authorization: `Bearer ${token()}` },
                signal: trackidDetailController.signal,
            })
            .then((response) => {
                const data = response.data.data;
                const stepArray = Array.from({ length: 7 }, () => "");
                const checkData = (step: string, index: number) => {
                    if (parseInt(data[step].negative)) stepArray[index] = "negative";
                    if (parseInt(data[step].positive)) stepArray[index] = "positive";
                };

                const stepList = [
                    "event_service_feasibility",
                    "event_package_subscription",
                    "event_user_kyc",
                    "callback_update_kyc",
                    "event_user_confirm_order",
                    "callback_technician_installation",
                    "callback_update_assignment_status",
                    "callback_revoke_order",
                ];

                stepList.forEach((step, index) => {
                    checkData(step, index);
                });

                if (!stepList.length) return reject("Data not found!");

                const filteredStep = stepArray.filter((exist) => exist);

                getMyIhxFunnelDetail({
                    date,
                    nextDate,
                    trackid,
                    step: stepList[filteredStep.length - 1],
                    state: filteredStep.at(-1),
                    page: 0,
                    row: 0,
                    regional: "",
                    witel: "",
                })
                    .then((responseFinal) => resolve(responseFinal))
                    .catch((errorFinal) => {
                        reject(errorFinal);
                    });
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};
