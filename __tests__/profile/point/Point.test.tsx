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

const getVoucherNotHaveData = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: {
                lists: [],
                totalData: 0,
            },
        },
    });
};

const getMyVoucher = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: {
                lists: [
                    { item: { itemName: "itemName", expDate: "expDate", price: "price", banner: "banner" } },
                    { item: { itemName: undefined, expDate: undefined, price: undefined, banner: undefined } },
                ],
                totalData: 2,
            },
        },
    });
};

const getMyVoucherNotHaveData = () => {
    return axios.get.mockResolvedValueOnce({
        data: { data: { lists: [], totalData: 0 } },
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

describe("Point page", () => {
    test("Test snapshot", async () => {
        axios.get.mockResolvedValueOnce({});
        getPointDescription();
        getTask();
        getMyWallet();
        getVoucher();

        const view = await renderPage();
        view.asFragment();
    });

    test("Point component: change point tab bar, point data undefined | Point description | Point history call", async () => {
        getPointDescription();
        getTaskNotHaveData();
        getMyWallet();
        getVoucherNotHaveData();
        axios.get.mockResolvedValueOnce({});
        getMyVoucherNotHaveData();

        await renderPage();

        const changeTabBar = screen.getAllByText("Tukar Poin")[1];
        fireEvent.click(changeTabBar);

        const descriptionButton = screen.getByText("di sini");
        fireEvent.click(descriptionButton);

        const historyButton = screen.getAllByText("Riwayat Poin")[0];
        fireEvent.click(historyButton);

        const completeButton = screen.getAllByText("Lengkapi Data Diri")[0];
        fireEvent.click(completeButton);
    });

    test("Point history totalData is 0", async () => {
        getPointDescription();
        getTask();
        getMyWallet();
        getVoucher();
        axios.get.mockResolvedValueOnce({});
        getMyVoucher();

        await renderPage();
    });

    test("Point history totalData > 0", async () => {
        getPointDescription();
        getTask();
        getMyWallet();
        getVoucher();

        await renderPage();
    });
});
