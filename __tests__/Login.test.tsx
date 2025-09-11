import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen, waitFor } from "@functions/test";

import Login from "@pages/login";

vi.mock("js-cookie");
vi.mock("@hooks/useProfile", () => ({
    default: () => ({ data: {} }),
}));
vi.mock("react-google-recaptcha-v3");

const inputRender = () => {
    render(<Login />);

    const usernameInput = screen.getByPlaceholderText("Masukkan email atau nomor handphone Anda");
    const passwordInput = screen.getByPlaceholderText("Masukkan password Anda");
    const signInButton = screen.getAllByText("Masuk")[1];

    fireEvent.change(usernameInput, { target: { value: "user@dummy.id" } });
    fireEvent.change(passwordInput, { target: { value: "hesoyam" } });

    return { signInButton };
};

describe("Login Page", () => {
    test("Test snapshot", () => {
        const view = render(<Login />);
        view.asFragment();
    });

    test("Remember me click", async () => {
        render(<Login />);
        const rememberMeButton = screen.getByText("Ingat saya");
        fireEvent.click(rememberMeButton);
        fireEvent.click(rememberMeButton);

        await waitFor(() => null);
    });

    test("Sign in click", async () => {
        render(<Login />);

        const usernameInput = screen.getByPlaceholderText("Masukkan email atau nomor handphone Anda");
        const passwordInput = screen.getByPlaceholderText("Masukkan password Anda");
        const signInButton = screen.getAllByText("Masuk")[1];

        fireEvent.change(usernameInput, { target: { value: "user@dummy.id" } });
        fireEvent.change(passwordInput, { target: { value: "hesoyam" } });

        axios.post.mockResolvedValue({ data: { data: { accessToken: "token" } } });
        axios.get.mockResolvedValue({ data: { data: { status: "verified" } } });

        fireEvent.click(signInButton);
    });

    test("Sign in click user status not verified", () => {
        const { signInButton } = inputRender();

        axios.post.mockResolvedValue({ data: { data: { accessToken: "token" } } });
        axios.get.mockResolvedValue({ data: { data: { status: "pending" } } });

        fireEvent.click(signInButton);
    });

    test("Sign in click reject", async () => {
        const { signInButton } = inputRender();

        axios.post.mockRejectedValue({ response: { data: "ok" } });
        fireEvent.click(signInButton);
        await waitFor(() => null);

        axios.post.mockRejectedValue({ response: { data: { code: 404 } } });
        fireEvent.click(signInButton);
        await waitFor(() => null);

        axios.post.mockRejectedValue({ response: { data: { code: 401 } } });
        fireEvent.click(signInButton);
        await waitFor(() => null);
    });

    test("Login with access telkom", async () => {
        render(<Login />);

        const accessTelkomForm = screen.getByText("Masuk dengan Telkom Akses");
        fireEvent.click(accessTelkomForm);
        await waitFor(() => screen.findByText("NIK Telkom Akses"));

        const usernameInput = screen.getByPlaceholderText("Masukkan NIK Anda");
        const passwordInput = screen.getByPlaceholderText("Masukkan password Anda");
        const signInButton = screen.getByText("Masuk");

        fireEvent.change(usernameInput, { target: { value: 123123 } });
        fireEvent.change(passwordInput, { target: { value: "hesoyam" } });

        axios.post.mockResolvedValue({ data: { data: { accessToken: "token" } } });
        axios.get.mockResolvedValue({ data: { data: { status: "verified" } } });

        fireEvent.click(signInButton);
    });

    test("Login with IndiHome Partner", async () => {
        render(<Login />);

        const indihomePartner = screen.getByText("Masuk dengan IndiHome Partner");
        fireEvent.click(indihomePartner);
        await waitFor(() => screen.findByText("NIK Indihome Partner"));

        const usernameInput = screen.getByPlaceholderText("Masukkan NIK Anda");
        const passwordInput = screen.getByPlaceholderText("Masukkan password Anda");
        const signInButton = screen.getByText("Masuk");

        fireEvent.change(usernameInput, { target: { value: 123123 } });
        fireEvent.change(passwordInput, { target: { value: "hesoyam" } });

        axios.post.mockResolvedValue({ data: { data: { accessToken: "token" } } });
        axios.get.mockResolvedValue({ data: { data: { status: "verified" } } });

        fireEvent.click(signInButton);
    });

    test("Login with NIK Telkom", async () => {
        render(<Login />);

        const nikTelkom = screen.getByText("Masuk dengan NIK Telkom");
        fireEvent.click(nikTelkom);
        await waitFor(() => screen.findByText("NIK Telkom"));

        const usernameInput = screen.getByPlaceholderText("Masukkan NIK Telkom Anda");
        const passwordInput = screen.getByPlaceholderText("Masukkan password Anda");
        const signInButton = screen.getByText("Masuk");

        fireEvent.change(usernameInput, { target: { value: 123123 } });
        fireEvent.change(passwordInput, { target: { value: "hesoyam" } });

        axios.post.mockResolvedValue({ data: { data: { accessToken: "token" } } });
        axios.get.mockResolvedValue({ data: { data: { status: "verified" } } });

        fireEvent.click(signInButton);
    });
});
