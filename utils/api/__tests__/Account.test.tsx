import { getCredential, getToken, getTokenMip } from "@api/account/auth";
import { changePassword, forgotPassword, verifyForgotPassword } from "@api/account/password";
import {
    blockUser,
    editCustomData,
    editEmailDirectProfile,
    editEmailProfile,
    editMobileDirectProfile,
    editMobileProfile,
    editPassword,
    editProfile,
    getCurrentUser,
    getListUser,
    rejectUser,
    resendOTP,
    unBlockUser,
    verifyOTPEmail,
    verifyOTPMobile,
    verifyUser,
} from "@api/account/user";

import { fetch } from "@functions/test";

test("getToken", async () => {
    fetch({ method: "post", func: getToken });
});

test("getCredential", async () => {
    fetch({ method: "post", func: getCredential });
});

test("getTokenMip", async () => {
    fetch({ method: "post", func: getTokenMip });
});

test("getCurrentUser", async () => {
    fetch({ method: "get", func: getCurrentUser });
});

test("getListUser", async () => {
    fetch({ method: "get", func: getListUser });
});

test("forgotPassword", async () => {
    fetch({ method: "post", func: forgotPassword });
});

test("verifyForgotPassword", async () => {
    fetch({ method: "post", func: verifyForgotPassword });
});

test("changePassword", async () => {
    fetch({ method: "post", func: changePassword });
});

test("blockUser", async () => {
    fetch({ method: "post", func: blockUser });
});

test("unBlockUser", async () => {
    fetch({ method: "post", func: unBlockUser });
});

test("editCustomData", async () => {
    fetch({ method: "post", func: editCustomData });
});

test("editProfile", async () => {
    fetch({ method: "post", func: editProfile });
});

test("verifyUser", async () => {
    fetch({ method: "post", func: verifyUser });
});

test("rejectUser", async () => {
    fetch({ method: "post", func: rejectUser });
});

test("editEmailProfile", async () => {
    fetch({ method: "post", func: editEmailProfile });
});

test("editMobileProfile", async () => {
    fetch({ method: "post", func: editMobileProfile });
});

test("verifyOTPEmail", async () => {
    fetch({ method: "post", func: verifyOTPEmail });
});

test("verifyOTPMobile", async () => {
    fetch({ method: "post", func: verifyOTPMobile });
});

test("editEmailDirectProfile", async () => {
    fetch({ method: "post", func: editEmailDirectProfile });
});

test("editMobileDirectProfile", async () => {
    fetch({ method: "post", func: editMobileDirectProfile });
});

test("editPassword", async () => {
    fetch({ method: "post", func: editPassword });
});

test("resendOTP", async () => {
    fetch({ method: "post", func: resendOTP });
});
