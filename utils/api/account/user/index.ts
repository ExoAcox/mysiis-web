import { CookieValueTypes } from "cookies-next";
import getConfig from "next/config";

import { axios, catchHelper, header } from "@libs/axios";

export interface User {
    userId: string;
    fullname: string;
    permission_keys: [];
    role_keys: [];
    roles?: [];
    email?: string;
    mobile?: string;
    telkomNIK?: string;
    telkomNIKType?: string;
    profilePicture?: string;
    fotoKTP?: string;
    fotoWajah?: string;
    status: "verified" | "pending" | "registered";
    verifiedData?: {
        verifiedAt?: Date;
        requestAt?: Date;
    };
    lockedAdmin?: {
        lockedAt?: string;
        lockedBy?: string;
    };
    customdata: {
        regional?: string;
        witel?: string;
        vendor?: string;
        tsel_region_branch?: {
            area?: string;
            region?: string;
            branch?: string;
            vendor?: string;
        }[];
    };
    emailAddedAt?: Date;
    mobileAddedAt?: Date;
    role_details?: {
        name?: string;
        roleId?: string;
    };
    addressProvince?: string;
    addressCity?: string;
    addressPostalCode?: string;
    addressSubDistrict?: string;
    addressDetail?: string;
    refCode?: string;
}

export const getCurrentUser = (token: string | CookieValueTypes): Promise<User> => {
    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/users/v1`, {
                headers: { Authorization: `Bearer ${token}`, apikey: process.env.NEXT_PUBLIC_API_KEY },
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

type UserStatus = "active" | "verified" | "rejected" | "blocked";

interface GetListUser<Param> {
    row: number;
    page: number;
    orderColumn?: string;
    orderBy?: "ASC" | "DESC";
    status?: UserStatus;
    regional?: string;
    witel?: string;
    region?: string[];
    branch?: string[];
    is_tsel?: boolean;
    vendor?: string;
    keyword?: string;
    roles?: string[];
    param?: Param;
}

export const getListUser = async <Param>(args: GetListUser<Param>): Promise<{ lists: User[]; totalCount: number }> => {
    const { row, page, orderColumn, orderBy, status = "verified", region, branch, vendor, roles } = args;
    const params = { row, page, status, regionList: region, branchList: branch, vendor, roles, orderColumn, orderBy, is_tsel: true };
    if (vendor === "") delete params.vendor;

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/users/v1/lists`, {
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

export const getListUserSupervisor = async (): Promise<{ lists: User[]; totalCount: number }> => {
    const params = { 
        row : 1000,
        page : 1,
        roles : ["49a4826a-6e53-4865-8f8d-2b4742e7d636"],
        status : "verified"
    };

    return new Promise((resolve, reject) => {
        axios
            .get(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/users/v1/lists`, {
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

export const verifyUser = (userId: string) => {
    const args = { admin_verified: true };

    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/users/v1/${userId}/verify-admin`, args, {
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

export const rejectUser = (userId: string) => {
    const args = { admin_rejected: true };

    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/users/v1/${userId}/reject-admin`, args, {
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

export const blockUser = (userId: string) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                process.env.NEXT_PUBLIC_ACCOUNT_URL + `/users/v1/${userId}/block`,
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

export const unBlockUser = (userId: string) => {
    return new Promise((resolve, reject) => {
        axios
            .post(
                process.env.NEXT_PUBLIC_ACCOUNT_URL + `/users/v1/${userId}/unblock`,
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

export const editCustomData = (args: any) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/users/v1/edit-customdata`, args, {
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

export const editProfile = (args: any): Promise<User> => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/users/v1`, args, {
                headers: {
                    Authorization: header().Authorization,
                    apikey: header().apikey,
                    "Content-Type": "application/x-www-form-urlencoded",
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

export const editEmailProfile = (args: { email: string }): Promise<User> => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/users/v1/add-email`, args, {
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

export interface EditMobileProfile {
    mobile: string;
    otp_channel: string;
}

export const editMobileProfile = (args: EditMobileProfile): Promise<User> => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/users/v1/add-mobile`, args, {
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

interface VerifyOTP {
    otp_code: string;
    is_active: boolean;
}

export const verifyOTPEmail = (args: VerifyOTP) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/users/v1/verify-email`, args, {
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

export const verifyOTPMobile = (args: VerifyOTP) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/users/v1/verify-mobile`, args, {
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

export interface EditEmailDirectProfile {
    email: string;
    password: string;
}

export const editEmailDirectProfile = (args: EditEmailDirectProfile): Promise<User> => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/users/v1/add-email-direct`, args, {
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

export interface EditMobileDirectProfile {
    mobile: string;
    password: string;
}

export const editMobileDirectProfile = (args: EditMobileDirectProfile): Promise<User> => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/users/v1/add-mobile-direct`, args, {
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

export interface EditPassword {
    old_password: string;
    new_password: string;
    confirm_new_password: string;
    "g-recaptcha-response": string;
}

export const editPassword = (args: EditPassword) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/users/v1/password/recaptcha`, args, {
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

interface ResendOTP {
    otp_field_key: string;
    otp_field_value: string;
    otp_channel: string;
}

export const resendOTP = (args: ResendOTP) => {
    return new Promise((resolve, reject) => {
        axios
            .post(process.env.NEXT_PUBLIC_ACCOUNT_URL + `/otp/v1/generate`, args, {
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
