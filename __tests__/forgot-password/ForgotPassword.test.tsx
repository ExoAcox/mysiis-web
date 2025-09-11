import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen } from "@functions/test";

import ForgotPassword from "@pages/forgot-password";

vi.mock("react-google-recaptcha-v3");

const renderPage = async () => {
    vi.useFakeTimers();
    const view = render(<ForgotPassword />);
    vi.advanceTimersByTime(1000);

    await vi.dynamicImportSettled();

    return view;
};

describe("Forgot password page", () => {
    test("Test snapshot", async () => {
        const view = await renderPage();
        view.asFragment();
    });

    test("Forgot password success", async () => {
        axios.post.mockResolvedValue({ data: {} });
        renderPage();

        const inputPhoneNumber = screen.getByPlaceholderText("Masukkan Email Anda");
        const smsButton = screen.getByText("Kirim ke Email");

        fireEvent.change(inputPhoneNumber, { target: { value: "082212341234" } });

        fireEvent.click(smsButton);
    });
});
