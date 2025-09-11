import getConfig from "next/config";

import { axios, catchHelper } from "@libs/axios";

interface ForgotPassword {
    forgot_field_key: "mobile" | "email";
    forgot_field_value: string;
    forgot_channel: "email" | "whatsapp" | "sms";
    recaptchaToken: string;
}

export const forgotPassword = (args: ForgotPassword): Promise<unknown> => {
    const { forgot_field_key, forgot_field_value, forgot_channel, recaptchaToken } = args;

    const formData = new FormData();
    formData.append("forgot_field_key", forgot_field_key);
    formData.append("forgot_field_value", forgot_field_value);
    formData.append("g-recaptcha-response", recaptchaToken);
    if (forgot_channel) formData.append("forgot_channel", forgot_channel);

    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/users/v1/pub/forgot/recaptcha`, formData, {
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

interface VerifyForgotPassword {
    forgot_field_key: "mobile" | "email";
    forgot_field_value: string;
    otp_code: string;
    expired_in?: number;
}

export const verifyForgotPassword = (args: VerifyForgotPassword): Promise<{ reset_password_token: string }> => {
    const { forgot_field_key, forgot_field_value, otp_code, expired_in } = args;

    const formData = new FormData();
    formData.append("forgot_field_key", forgot_field_key);
    formData.append("forgot_field_value", forgot_field_value);
    formData.append("otp_code", String(otp_code));
    if (expired_in) formData.append("expired_in", String(expired_in));

    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/users/v1/pub/verify-forgot-password`, formData, {
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

interface ChangePassword {
    new_password: string;
    confirm_new_password: string;
    token_reset_password: string;
}

export const changePassword = (args: ChangePassword): Promise<unknown> => {
    const { new_password, confirm_new_password, token_reset_password } = args;

    const formData = new FormData();
    formData.append("new_password", new_password);
    formData.append("confirm_new_password", confirm_new_password);
    formData.append("token_reset_password", token_reset_password);

    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/users/v1/pub/change-password`, formData, {
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
