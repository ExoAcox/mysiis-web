import { AxiosBasicCredentials } from "axios";
import getConfig from "next/config";

import { axios, catchHelper, guestHeader } from "@libs/axios";

interface Token {
    accessToken: string;
    refreshToken: string;
}

export const dummyApi = () => {
    return new Promise((resolve) => {
        const iniDummy = { nama: "hai" };
        resolve({ data: { data: iniDummy } });
    });
};

export const getToken = (args: URLSearchParams): Promise<Token> => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/users/v1/auth/recaptcha`, args, {
                headers: { apikey: process.env.NEXT_PUBLIC_API_KEY },
                auth: { username: process.env.NEXT_PUBLIC_MYSIIS_USERNAME, password: process.env.NEXT_PUBLIC_MYSIIS_PASSWORD },
                skipAuthRefresh: true,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const getTokenMip = async (guid: string): Promise<Token> => {
    const headers = await guestHeader();

    const params = new URLSearchParams();
    params.append("token", guid);
    params.append("roles", JSON.stringify(["5f377b5b-6b69-4eed-a603-7ed7feffaee1"]));

    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/users/v1/token/mip`, params, {
                headers,
                skipAuthRefresh: true,
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};

export const getCredential = (auth?: AxiosBasicCredentials): Promise<Token> => {
    const params = new URLSearchParams();
    params.append("grant_type", "client_credentials");

    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/users/v1/auth/client`, params, {
                headers: { apikey: process.env.NEXT_PUBLIC_API_KEY },
                auth: auth ?? {
                    username: process.env.NEXT_PUBLIC_MYSIIS_USERNAME,
                    password: process.env.NEXT_PUBLIC_MYSIIS_PASSWORD,
                },
                skipAuthRefresh: true,
                cache: { methods: ["post"], ttl: 1000 * 60 * 90, ...localStorage },
            })
            .then((response) => {
                resolve(response.data.data);
            })
            .catch((error) => {
                catchHelper(reject, error);
            });
    });
};
