import React from "react";
import { describe, expect, vi } from "vitest";

import { fireEvent, render, screen, user, waitFor } from "@functions/test";

import Profile from "@pages/profile";

const renderPage = async (args?: { access: Access }) => {
    const { access = "allowed" } = args || {};

    const view = render(<Profile user={user} access={access} />);

    return view;
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

describe("Profile no address page", () => {
    test("Test snapshot", async () => {
        const view = await renderPage();
        view.asFragment();
    });

    test("Profile no address edit", async () => {
        await renderPage();

        const completeButton = screen.getByText("Lengkapi Sekarang");
        fireEvent.click(completeButton);
    });

    test("Profile no address edit email", async () => {
        await renderPage();

        const email = screen.getAllByText("Ubah")[0];
        fireEvent.click(email);
    });

    test("Profile no address edit mobile", async () => {
        await renderPage();

        const mobile = screen.getAllByText("Ubah")[1];
        fireEvent.click(mobile);
    });
});
