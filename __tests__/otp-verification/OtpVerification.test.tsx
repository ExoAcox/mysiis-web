import React from "react";
import { describe, vi } from "vitest";

import { fireEvent, render, screen } from "@functions/test";

import OtpVerification from "@pages/otp-verification";

const renderPage = async (args?: { phoneNumber: string }) => {
    const { phoneNumber = "082212341234" } = args || {};

    vi.useFakeTimers();
    const view = render(<OtpVerification phoneNumber={phoneNumber} />);
    vi.advanceTimersByTime(1000);

    await vi.dynamicImportSettled();

    return view;
};

describe("New Password", () => {
    test("Test snapshot", async () => {
        const view = await renderPage();
        view.asFragment();
    });

    test("Verification otp code", () => {
        renderPage();

        const otpInput = screen.getAllByPlaceholderText("•");
        const otpSubmitButton = screen.getByText("Verifikasi OTP");

        fireEvent.change(otpInput[0], { target: { value: "3" } });
        fireEvent.change(otpInput[1], { target: { value: "2" } });
        fireEvent.change(otpInput[2], { target: { value: "1" } });
        fireEvent.change(otpInput[3], { target: { value: "3" } });
        fireEvent.change(otpInput[4], { target: { value: "2" } });
        fireEvent.change(otpInput[5], { target: { value: "1" } });

        fireEvent.click(otpSubmitButton);
    });
});
