import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen, user, waitFor } from "@functions/test";

import PointBanner from "@features/profile/components/Point/components/PointBanner/Banner";

const renderPage = async () => {
    const view = render(<PointBanner />);
    return view;
};

const getAllBanner = () => {
    return axios.get.mockResolvedValue({
        data: {
            data: {
                lists: [
                    {
                        id: "1",
                        image_url: "image_url",
                        updated_at: "12-12-2012",
                        created_at: "12-12-2012",
                        url: "url",
                    },
                    {
                        id: "2",
                        image_url: "image_url",
                        updated_at: "12-12-2012",
                        created_at: "12-12-2012",
                        url: "url",
                    },
                ],
            },
        },
    });
};

const getCredential = () => {
    return axios.post.mockResolvedValue({
        data: {
            data: {
                accessToken: "accessToken",
                refreshToken: "refreshToken",
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

describe("Point banner features", () => {
    test("Test snapshot", async () => {
        getCredential();
        getAllBanner();
        await waitFor(() => null);

        const view = await renderPage();
        view.asFragment();
    });

    test("Point banner features", async () => {
        await renderPage();

        const swiperPagination = screen.getByTestId("swiper-pagination-0");
        fireEvent.click(swiperPagination);
    });
});
