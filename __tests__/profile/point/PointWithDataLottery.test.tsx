import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen, user, waitFor } from "@functions/test";

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

const getVoucherLottery = () => {
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
                        type: "lottery",
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

const getMyVoucherNotHaveData = () => {
    return axios.get.mockResolvedValueOnce({
        data: { data: { lists: [], totalData: 0 } },
    });
};

vi.mock("@hooks/useProfile", () => ({
    default: () => ({
        userId: "id",
        fullname: "John Cena",
        status: "verified",
        email: "john@mail.com",
        mobile: "0812345678910",
        addressProvince: "JAWA TIMUR",
        addressCity: "NGAWI",
        addressPostalCode: "1234",
        addressSubDistrict: "KARANGANYAR",
        addressDetail: "test",
    }),
}));

vi.mock("@hooks/usePoint", () => ({
    default: () => ({
        data: undefined,
        isPending: false,
        isSuccess: true,
    }),
}));

describe("Point with data lottery", () => {
    test("Point with data lottery snapshot", async () => {
        axios.get.mockResolvedValueOnce({});
        getPointDescription();
        getTask();
        getMyWallet();
        getVoucherLottery();

        const view = await renderPage();
        view.asFragment();
    });

    test("Point with data lottery component", async () => {
        getPointDescription();
        getTaskNotHaveData();
        getMyWallet();
        getVoucherLottery();
        axios.get.mockResolvedValueOnce({});
        getMyVoucherNotHaveData();
        axios.post.mockResolvedValueOnce({});
        axios.post.mockResolvedValueOnce({ data: { data: {} } });

        await renderPage();

        const changeTabBar = screen.getAllByText("Tukar Poin")[1];
        fireEvent.click(changeTabBar);

        const descriptionButton = screen.getByText("di sini");
        fireEvent.click(descriptionButton);

        const historyButton = screen.getAllByText("Riwayat Poin")[0];
        fireEvent.click(historyButton);

        const redeemButton = screen.getAllByText("Tukar Poin")[0];
        fireEvent.click(redeemButton);

        const cancelRedeemButton = screen.getAllByText("Batal")[0];
        fireEvent.click(cancelRedeemButton);

        fireEvent.click(redeemButton);

        const redeemButtonClick = screen.getAllByText("Redeem")[0];
        fireEvent.click(redeemButtonClick);
        await waitFor(() => null);
        // await waitFor(() => screen.findByText("Berhasil Menukar Voucher Undian"));

        // const okButtonClick = screen.getAllByText("Oke")[0];
        // fireEvent.click(okButtonClick);
    });
});
