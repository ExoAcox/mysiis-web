import getConfig from "next/config";

import { axios, catchHelper } from "@libs/axios";

export interface Mask {
    id: string;
    words: string;
    label: string;
}

export const getMask = (): Promise<Mask[]> => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_RPA_WIBS_URL + "/wibs/v1/config/mask", {
                auth: {
                    username: process.env.NEXT_PUBLIC_TELKOM_USERNAME,
                    password: process.env.NEXT_PUBLIC_RPA_WIBS_PASSWORD,
                },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

interface CreateMask {
    words: string;
    label: string;
}

export const createMask = (args: CreateMask): Promise<Mask[]> => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_RPA_WIBS_URL + "/wibs/v1/config/mask", args, {
                auth: {
                    username: process.env.NEXT_PUBLIC_TELKOM_USERNAME,
                    password: process.env.NEXT_PUBLIC_RPA_WIBS_PASSWORD,
                },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const deleteMask = (id: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        axios
            .delete(process.env.NEXT_PUBLIC_RPA_WIBS_URL + "/wibs/v1/config/mask/" + id, {
                auth: {
                    username: process.env.NEXT_PUBLIC_TELKOM_USERNAME,
                    password: process.env.NEXT_PUBLIC_RPA_WIBS_PASSWORD,
                },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};
