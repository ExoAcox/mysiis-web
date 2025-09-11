import axios from "axios";
import { setCookie } from "cookies-next";
// import { logEvent } from "firebase/analytics";
import { nanoid } from "nanoid";

// import { analytic } from "@libs/firebase";
// import { socket } from "@libs/socket";
import { getToken } from "@api/account/auth";
import { User, getCurrentUser } from "@api/account/user";

import { errorHelper } from "@functions/common";

interface Props {
    type: LoginType;
    input: { username: string; password: string };
    isRememberMe: boolean;
    recaptchaToken: string;
    setLoading: (value: boolean) => void;
    setError: (error: DataError) => void;
    onSuccess: (profile: User) => void;
}

export enum LoginType {
    EMAIL_OR_PHONE_NUMBER,
    NIK,
    INDIHOME_PARTNER,
    TELKOM_ACCESS,
}

export const saveData = async ({ type, input, setLoading, setError, onSuccess, isRememberMe, recaptchaToken }: Props) => {
    setLoading(true);
    setError(null);

    const params = new URLSearchParams();

    params.append("username", input.username);
    params.append("password", input.password);
    params.append("grant_type", "password");
    params.append("g-recaptcha-response", recaptchaToken);

    if (type === LoginType.NIK) {
        params.append("nik_type", "telkom");
        params.append("is_active_nik", "true");
        params.append("is_verified_nik", "true");
        params.append("nik_roleid", "3c32b1d1-854b-428a-899e-aaa08f689274");
    }

    if (type === LoginType.INDIHOME_PARTNER) {
        params.append("nik_type", "ih-partner");
        params.append("is_active_nik", "true");
        params.append("is_verified_nik", "true");
        params.append("nik_roleid", "5f377b5b-6b69-4eed-a603-7ed7feffaee1");
    }

    if (type === LoginType.TELKOM_ACCESS) {
        params.append("nik_type", "telkomakses");
        params.append("is_active_nik", "true");
        params.append("is_verified_nik", "true");
        params.append("nik_roleid", "8514953e-0b1d-454c-a0fe-d619d19e101b");
    }

    try {
        const token = await getToken(params);
        const profile = await getCurrentUser(token.accessToken);
        const { userId, fullname, profilePicture, role_keys, permission_keys, customdata, role_details } = profile;
        const { regional = "", witel = "", vendor = "", tsel_region_branch = [] } = customdata || {};
        const uuid = nanoid();

        if (profile.status !== "verified") {
            setError({ code: 422, message: "Akun anda belum terverifikasi, silahkan hubungi Supervisor terkait" });
            return setLoading(false);
        }

        if (process.env.NODE_ENV === "production") {
            // logEvent(analytic, "mysiis-login", {
            //     userId,
            //     name: fullname,
            //     regional,
            //     witel,
            //     role: role_details?.name ?? "",
            //     roleId: role_details?.roleId ?? "",
            //     platform: "web",
            //     status: "success",
            // });
        }

        // socket.emit("create-session", { userId, uuid });

        await axios.post(isRememberMe ? "/api/login" : "/api/login-temp", {
            userId,
            fullname,
            profilePicture,
            permission_keys,
            role_keys,
            uuid,
            regional,
            witel,
            vendor,
            tsel_area: tsel_region_branch.length > 0 ? tsel_region_branch[0]["area"] : "",
            tsel_region: tsel_region_branch.length > 0 ? tsel_region_branch[0]["region"] : "",
            tsel_branch: tsel_region_branch.length > 0 ? tsel_region_branch[0]["branch"] : "",
            tsel_vendor: tsel_region_branch.length > 0 ? tsel_region_branch[0]["vendor"] : "",
        });

        setCookie(process.env.NEXT_PUBLIC_TOKEN_KEY, token.accessToken, { maxAge: 60 * 60 * 365, sameSite: "strict" });
        setCookie(process.env.NEXT_PUBLIC_REFRESH_TOKEN_KEY, token.refreshToken, { maxAge: 60 * 60 * 365, sameSite: "strict" });
        onSuccess(profile);

        setLoading(false);
    } catch (error) {
        if (process.env.NODE_ENV === "production") {
            // logEvent(analytic, "mysiis-login", {
            //     username: input.username,
            //     platform: "web",
            //     status: "error",
            //     error: (error as FetchError)?.message,
            // });
        }

        setError(errorHelper(error));
        setLoading(false);
    }
};
