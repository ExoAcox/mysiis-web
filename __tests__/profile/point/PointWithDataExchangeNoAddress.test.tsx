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

const getVoucherNoNeedAddress = () => {
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
                        isNeedAddress: false,
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

describe("Point with data exchange no need address", () => {
    test("Point with data exchange no need address snapshot", async () => {
        axios.get.mockResolvedValueOnce({});
        getPointDescription();
        getTask();
        getMyWallet();
        getVoucherNoNeedAddress();

        const view = await renderPage();
        view.asFragment();
    });

    test("Point with data exchange no need address to trigger modalPointRedeemAddressConfirmation", async () => {
        getPointDescription();
        getTaskNotHaveData();
        getMyWallet();
        getVoucherNoNeedAddress();

        await renderPage();

        const redeemButton = screen.getAllByText("Tukar Poin")[0];
        fireEvent.click(redeemButton);

        const cancelRedeemButton = screen.getAllByText("Batal")[0];
        fireEvent.click(cancelRedeemButton);

        fireEvent.click(redeemButton);

        const redeemButtonClick = screen.getAllByText("Redeem")[0];
        fireEvent.click(redeemButtonClick);

        const addressConfirmationButton = screen.getByText("Cek Kembali");
        fireEvent.click(addressConfirmationButton);
    });

    test("Point with data exchange no need address to trigger modalPointRedeemAddressConfirmation", async () => {
        getPointDescription();
        getTaskNotHaveData();
        getMyWallet();
        getVoucherNoNeedAddress();

        await renderPage();

        const redeemButton = screen.getAllByText("Tukar Poin")[0];
        fireEvent.click(redeemButton);

        const cancelRedeemButton = screen.getAllByText("Batal")[0];
        fireEvent.click(cancelRedeemButton);

        fireEvent.click(redeemButton);

        const redeemButtonClick = screen.getAllByText("Redeem")[0];
        fireEvent.click(redeemButtonClick);

        const addressConfirmationButton = screen.getByText("Ya");
        fireEvent.click(addressConfirmationButton);
    });
});
