import React from "react";
import { describe } from "vitest";

import { fireEvent, render, screen, user } from "@functions/test";

import NotificationMobile from "@pages/profile/m";

const renderPage = async () => {
    const view = render(<NotificationMobile user={user} />);

    return view;
};

describe("Mobile page", () => {
    test("Test snapshot", async () => {
        const view = await renderPage();
        view.asFragment();
    });

    test("Test click", async () => {
        renderPage();

        const about = await screen.findAllByText("Tentang mySIIS");
        fireEvent.click(about[1]);

        const faq = await screen.findAllByText("FAQ");
        fireEvent.click(faq[1]);

        const logout = await screen.findAllByText("Keluar");
        fireEvent.click(logout[0]);
    });
});
