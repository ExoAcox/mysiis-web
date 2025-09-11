import React from "react";
import { describe, expect, vi } from "vitest";

import { axios, fireEvent, render, screen, user, waitFor } from "@functions/test";

import Profile from "@pages/profile";

const renderPage = async (args?: { access: Access }) => {
    const { access = "allowed" } = args || {};

    const view = render(<Profile user={user} access={access} />);

    return view;
};

const editProfile = () => {
    return axios.post.mockResolvedValueOnce({
        data: {
            data: {
                userId: "id",
                fullname: "John Cenah",
                status: "verified",
                email: "john@mail.com",
                mobile: "0812345678910",
                addressProvince: "JAWA TIMUR",
                addressCity: "NGAWI",
                addressPostalCode: "1234",
                addressSubDistrict: "KARANGANYAR",
                addressDetail: "test",
            },
        },
    });
};

const editMobileDirectProfile = () => {
    return axios.post.mockResolvedValueOnce({
        data: {
            data: {
                userId: "id",
                fullname: "John Cenah",
                status: "verified",
                email: "john@mail.com",
                mobile: "0812345678910",
                addressProvince: "JAWA TIMUR",
                addressCity: "NGAWI",
                addressPostalCode: "1234",
                addressSubDistrict: "KARANGANYAR",
                addressDetail: "test",
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
        profilePicture: "profilePicture",
        role_details: { name: "name" },
        customdata: { regional: "regional", witel: "witel" },
    }),
}));

vi.mock("@hooks/usePoint", () => ({
    default: () => ({
        data: undefined,
        isPending: false,
        isSuccess: true,
    }),
}));

vi.mock("next/router", () => ({
    useRouter: () => ({
        reload: vi.fn(),
    }),
}));

vi.mock("next/image");

window.URL.createObjectURL = vi.fn();

describe("Profile page", () => {
    test("Test snapshot", async () => {
        const view = await renderPage();
        view.asFragment();
    });

    test("Profile edit error", async () => {
        axios.post.mockRejectedValueOnce({});

        await renderPage();

        const search = screen.getByPlaceholderText("Masukkan nama Anda");
        fireEvent.change(search, { target: { value: "John Cenah" } });

        const email = screen.getAllByText("Ubah")[0];
        fireEvent.click(email);

        const mobile = screen.getAllByText("Ubah")[1];
        fireEvent.click(mobile);

        const profilePicture = screen.getByTestId("profile-picture");
        fireEvent.change(profilePicture, {
            target: { files: [new File(["(⌐□_□)"], "image.png", { type: "image/png" })] },
        });
        await waitFor(() => null);

        const saveButton = screen.getByText("Simpan");
        fireEvent.click(saveButton);
    });

    test("Profile edit success", async () => {
        editProfile();

        await renderPage();

        const search = screen.getByPlaceholderText("Masukkan nama Anda");
        fireEvent.change(search, { target: { value: "John Cenah" } });

        const profilePicture = screen.getByTestId("profile-picture");
        fireEvent.change(profilePicture, {
            target: { files: [new File(["(⌐□_□)"], "image.png", { type: "image/png" })] },
        });
        await waitFor(() => null);

        const saveButton = screen.getByText("Simpan");
        fireEvent.click(saveButton);
    });

    test("Profile edit success email", async () => {
        editProfile();

        await renderPage();

        const email = screen.getAllByText("Ubah")[0];
        
        fireEvent.click(email);
        await waitFor(() => null);

        const closeButton = screen.getByTitle("email-change-modal");
        fireEvent.click(closeButton);

        fireEvent.click(email);
        await waitFor(() => null);

        const cancelButton = screen.getAllByText("Batal")[0];
        fireEvent.click(cancelButton);

        fireEvent.click(email);
        await waitFor(() => null);

        const inputEmail = screen.getByPlaceholderText("Masukkan Email");
        fireEvent.change(inputEmail, { target: { value: "john_update@gmail.com" } });

        vi.useFakeTimers();
        const changeButton = screen.getAllByText("Ubah")[2];
        fireEvent.click(changeButton);
        vi.advanceTimersByTime(1000);
        await waitFor(() => null);
    });

    test("Profile edit success mobile", async () => {
        editProfile();
        editMobileDirectProfile();

        await renderPage();

        const mobile = screen.getAllByText("Ubah")[1];

        fireEvent.click(mobile);
        await waitFor(() => null);

        const closeButton = screen.getByTitle("mobile-change-modal");
        fireEvent.click(closeButton);

        fireEvent.click(mobile);
        await waitFor(() => null);

        const cancelButton = screen.getAllByText("Batal")[1];
        fireEvent.click(cancelButton);

        fireEvent.click(mobile);
        await waitFor(() => null);

        const inputMobile = screen.getByPlaceholderText("Masukkan Nomor Handphone");
        fireEvent.change(inputMobile, { target: { value: "0812345678910" } });
        fireEvent.change(inputMobile, { target: { value: "0812345678911" } });

        vi.useFakeTimers();
        const changeButton = screen.getAllByText("Ubah")[3];
        fireEvent.click(changeButton);
        vi.advanceTimersByTime(1000);
        await waitFor(() => screen.findByText("Masukkan Password"));

        const closePasswordButton = screen.getByTitle("verification-password-modal");
        fireEvent.click(closePasswordButton);

        fireEvent.click(mobile);
        await waitFor(() => null);

        fireEvent.change(inputMobile, { target: { value: "0812345678911" } });

        vi.useFakeTimers();
        fireEvent.click(changeButton);
        vi.advanceTimersByTime(1000);
        await waitFor(() => screen.findByText("Masukkan Password"));

        const inputPassword = screen.getByPlaceholderText("Masukkan Password");
        fireEvent.change(inputPassword, { target: { value: "123456" } });

        const saveButton = screen.getAllByText("Simpan")[0];

        vi.useFakeTimers();
        fireEvent.click(saveButton);
        vi.advanceTimersByTime(1000);
        await waitFor(() => null);
    });
});
