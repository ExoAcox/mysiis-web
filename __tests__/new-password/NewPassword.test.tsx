import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen, waitFor } from "@functions/test";

import NewPassword from "@pages/new-password";

const renderPage = async (args?: { resetPasswordToken: string }) => {
    const { resetPasswordToken = "token" } = args || {};

    vi.useFakeTimers();
    const view = render(<NewPassword resetPasswordToken={resetPasswordToken} />);
    vi.advanceTimersByTime(1000);

    await vi.dynamicImportSettled();

    return view;
};

describe("New Password", () => {
    test("Test snapshot", async () => {
        const view = await renderPage();
        view.asFragment();
    });
});
