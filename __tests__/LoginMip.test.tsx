import React from "react";
import { describe, vi } from "vitest";

import { axios, render } from "@functions/test";

import LoginMip from "@pages/login-mip";

const renderPage = (args?: { token: string }) => {
    const { token = "token" } = args || {};
    const view = render(<LoginMip token={token} />);
    return view;
};

describe("Login Mip", () => {
    test("Test snapshot", async () => {
        axios.post.mockResolvedValue({ data: { data: { accessToken: "token" } } });
        axios.get.mockResolvedValue({ data: { data: { status: "verified" } } });

        const view = renderPage();
        view.asFragment();
    });

    test("Login Mip error", () => {
        axios.post.mockRejectedValue({ data: { data: { accessToken: "token" } } });

        renderPage();
    });
});
