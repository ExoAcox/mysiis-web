import { AxiosProgressEvent } from "axios";

import { axios, catchHelper, header } from "@libs/axios";

let getPoolingController: AbortController;

interface GetPooling {
    row: number;
    page: number;
    status?: string[];
    filename?: string;
    created_at_start?: string;
    created_at_end?: string;
}

export interface Pooling {
    id: string;
    filename: string;
    task_count: number;
    finish_count: number;
    fail_count: number;
    created_at: string;
    running_at: string;
    finished_at: string;
    status: "REQUESTED" | "FAILED" | "FINISHED";
}

export const getPooling = (params: GetPooling): Promise<{ lists: Pooling[]; totalData: number }> => {
    getPoolingController?.abort();
    getPoolingController = new AbortController();

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_RPA_URL + `/api/pooling/v1`, {
                params,
                headers: { Authorization: header().Authorization },
                cache: false,
            })
            .then((response) => {
                resolve({ lists: response.data.data, totalData: response.data.meta?.count });
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

let getPoolingDetailController: AbortController;

interface GetPoolingDetail extends GetPooling {
    poolingId: string;
}

export const getPoolingDetail = (params: GetPoolingDetail, onDownloadProgress?: (event: AxiosProgressEvent) => void): Promise<Pooling[]> => {
    getPoolingDetailController?.abort();
    getPoolingDetailController = new AbortController();

    const { poolingId, row, page } = params;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_RPA_URL + `/api/pooling/v1/${poolingId}/detail`, {
                params: { row, page },
                headers: { Authorization: header().Authorization },
                cache: false,
                onDownloadProgress,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

let uploadPoolingController: AbortController;

export const uploadPooling = (file: File, onUploadProgress?: (event: AxiosProgressEvent) => void) => {
    uploadPoolingController?.abort();
    uploadPoolingController = new AbortController();

    const formData = new FormData();
    formData.append("requested_file", file);

    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_RPA_URL + `/api/pooling/v1/upload`, formData, {
                headers: { Authorization: header().Authorization },
                onUploadProgress,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};
