import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen, user, waitFor } from "@functions/test";

import ChangePassword from "@pages/profile/change-password";

const renderPage = async (args?: { access: Access }) => {
    const { access = "allowed" } = args || {};

    const view = render(<ChangePassword user={user} access={access} />);

    return view;
};

const editProfile = () => {
    return axios.post.mockResolvedValueOnce({
        data: {
            data: {
                userId: "id",
                fullname: "John Cena",
                status: "verified",
                email: "john@mail.com",
                mobile: "0812345678910",
                addressProvince: "KOTA BANDUNG",
                addressCity: "ANTAPANI",
                addressPostalCode: "40291",
                addressSubDistrict: "ANTAPANI",
                addressDetail: "Jalan",
            },
        },
    });
};

vi.mock("react-google-recaptcha-v3");

describe("ChangePassword page", () => {
    test("Test snapshot", async () => {
        const view = await renderPage();
        view.asFragment();
    });

    test("Change password form error min length", async () => {
        await renderPage();

        const oldPasswordInput = screen.getByPlaceholderText("Masukkan password lama Anda");
        fireEvent.change(oldPasswordInput, { target: { value: "old" } });

        const newPasswordInput = screen.getByPlaceholderText("Masukkan password baru Anda");
        fireEvent.change(newPasswordInput, { target: { value: "new" } });

        const confirmNewPasswordInput = screen.getByPlaceholderText("Konfirmasi password baru Anda");
        fireEvent.change(confirmNewPasswordInput, { target: { value: "news" } });

        const saveButton = screen.getByText("Simpan");
        fireEvent.click(saveButton);
    });

    test("Change password form error not match", async () => {
        await renderPage();

        const oldPasswordInput = screen.getByPlaceholderText("Masukkan password lama Anda");
        fireEvent.change(oldPasswordInput, { target: { value: "oldPassword" } });

        const newPasswordInput = screen.getByPlaceholderText("Masukkan password baru Anda");
        fireEvent.change(newPasswordInput, { target: { value: "newPassword" } });

        const confirmNewPasswordInput = screen.getByPlaceholderText("Konfirmasi password baru Anda");
        fireEvent.change(confirmNewPasswordInput, { target: { value: "newPasswords" } });

        const saveButton = screen.getByText("Simpan");
        fireEvent.click(saveButton);
    });

    test("Change password form error save", async () => {
        await renderPage();

        const oldPasswordInput = screen.getByPlaceholderText("Masukkan password lama Anda");
        fireEvent.change(oldPasswordInput, { target: { value: "oldPassword" } });

        const newPasswordInput = screen.getByPlaceholderText("Masukkan password baru Anda");
        fireEvent.change(newPasswordInput, { target: { value: "newPassword" } });

        const confirmNewPasswordInput = screen.getByPlaceholderText("Konfirmasi password baru Anda");
        fireEvent.change(confirmNewPasswordInput, { target: { value: "newPassword" } });

        axios.post.mockRejectedValueOnce({});
        const saveButton = screen.getByText("Simpan");
        fireEvent.click(saveButton);
    });

    test("Change password form success", async () => {
        await renderPage();

        const oldPasswordInput = screen.getByPlaceholderText("Masukkan password lama Anda");
        fireEvent.change(oldPasswordInput, { target: { value: "oldPassword" } });

        const newPasswordInput = screen.getByPlaceholderText("Masukkan password baru Anda");
        fireEvent.change(newPasswordInput, { target: { value: "newPassword" } });

        const confirmNewPasswordInput = screen.getByPlaceholderText("Konfirmasi password baru Anda");
        fireEvent.change(confirmNewPasswordInput, { target: { value: "newPassword" } });

        editProfile();
        const saveButton = screen.getByText("Simpan");
        fireEvent.click(saveButton);

        await waitFor(() => screen.findByText("Password Berhasil Diubah"));

        const closeIcon = screen.getByTitle("close-svg");
        fireEvent.click(closeIcon);

        const closeButton = screen.getByText("Masuk ke halaman profil mySIIS");
        fireEvent.click(closeButton);
    });
});
