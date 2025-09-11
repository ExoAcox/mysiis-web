import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen, user } from "@functions/test";

import Point from "@pages/profile/point";

const renderPage = async (args?: { access?: Access }) => {
    const { access = "allowed" } = args || {};

    const view = render(<Point user={user} access={access} />);

    return view;
};

const getPointDescription = () => {
    return axios.get.mockResolvedValueOnce({ data: { data: [{ key: "key", label: { id: "id" }, answer: { id: "id" } }] } });
};

const getTask = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: {
                lists: [
                    {
                        isShowWeb: true,
                        unit: 1,
                        pointLabel: "pointLabel",
                        title: { id: "id" },
                        subtitle: { id: "id" },
                        image: "image",
                        log_details: [{ addedBalancedAt: "addedBalancedAt" }],
                    },
                    {
                        isShowWeb: true,
                        unit: 2,
                        pointLabel: "pointLabel",
                        title: { id: "id" },
                        subtitle: { id: "id" },
                        image: "image",
                        log_details: [],
                    },
                ],
            },
        },
    });
};

const getTaskNotHaveData = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: {
                lists: [],
            },
        },
    });
};

const getMyWallet = () => {
    return axios.get.mockResolvedValueOnce({ data: { data: { balance: 1000 } } });
};

const getVoucher = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: {
                lists: [
                    {
                        itemId: "itemId",
                        itemName: "itemName",
                        status: "status",
                        expDate: "expDate",
                        banner: "banner",
                        type: "type",
                        desc: "desc",
                        price: 1,
                        isNeedAddress: true,
                    },
                ],
                totalData: 1,
            },
        },
    });
};

vi.mock("@hooks/useProfile", () => ({
    default: () => ({
        userId: "id",
        fullname: "",
        status: "",
        email: "",
        mobile: "",
        addressProvince: "",
        addressCity: "",
        addressPostalCode: "",
        addressSubDistrict: "",
        addressDetail: "",
    }),
}));

vi.mock("@hooks/usePoint", () => ({
    default: () => ({
        data: undefined,
        isPending: false,
        isSuccess: true,
    }),
}));

describe("Point with data exchange no profile", () => {
    test("Point with data exchange no profile snapshot", async () => {
        axios.get.mockResolvedValueOnce({});
        getPointDescription();
        getTask();
        getMyWallet();
        getVoucher();

        const view = await renderPage();
        view.asFragment();
    });

    test("Point with data exchange no profile to trigger modalPointRedeemAddressCheck", async () => {
        getPointDescription();
        getTaskNotHaveData();
        getMyWallet();
        getVoucher();

        await renderPage();

        const redeemButton = screen.getAllByText("Tukar Poin")[0];
        fireEvent.click(redeemButton);

        const cancelRedeemButton = screen.getAllByText("Batal")[0];
        fireEvent.click(cancelRedeemButton);

        fireEvent.click(redeemButton);

        const redeemButtonClick = screen.getAllByText("Redeem")[0];
        fireEvent.click(redeemButtonClick);

        const addressCheckCancelButton = screen.getAllByText("Batal")[1];
        fireEvent.click(addressCheckCancelButton);

        fireEvent.click(redeemButton);
        fireEvent.click(redeemButtonClick);

        const addressCheckButton = screen.getAllByText("Lengkapi Data Diri")[1];
        fireEvent.click(addressCheckButton);
    });
});
