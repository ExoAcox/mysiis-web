import { googleMaps } from "@exoacox/google-maps-vitest-mocks";
import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen, user, waitFor } from "@functions/test";

import Address from "@pages/profile/address";

const renderPage = async (args?: { access: Access }) => {
    const { access = "allowed" } = args || {};

    const view = render(<Address user={user} access={access} />);

    return view;
};

const getProvinsi = () => {
    return axios.get.mockResolvedValueOnce({
        data: { data: [{ provinsi: "JAWA TENGAH" }, { provinsi: "JAWA BARAT" }] },
    });
};

const getKabupaten = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: [
                {
                    st_name: "st_name",
                    kode_desa_dagri: "123",
                    kelurahan: "kelurahan",
                    kecamatan: "kecamatan",
                    kota: "KABUPATEN BANDUNG",
                    provinsi: "JAWA BARAT",
                    long: "123",
                    lat: "123",
                },
                {
                    st_name: "st_name",
                    kode_desa_dagri: "124",
                    kelurahan: "kelurahan",
                    kecamatan: "kecamatan",
                    kota: "KOTA BANDUNG",
                    provinsi: "JAWA BARAT",
                    long: "124",
                    lat: "124",
                },
            ],
        },
    });
};

const getKecamatan = () => {
    return axios.get.mockResolvedValueOnce({
        data: { data: [{ kecamatan: "CILEUNYI" }, { kecamatan: "ANTAPANI" }] },
    });
};

const getKelurahanByLocation = () => {
    return axios.get.mockResolvedValueOnce({
        data: { data: { geom: "POLYGON", st_name: "string", kelurahan: "string", kecamatan: "string", kota: "string", provinsi: "string" } },
    });
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

googleMaps();

describe("Address page", () => {
    test("Test snapshot", async () => {
        axios.get.mockResolvedValueOnce({});

        const view = await renderPage();
        view.asFragment();
    });

    test("Input form success close with icon", async () => {
        getProvinsi();

        renderPage();

        const provinsi = await screen.findByText("Pilih Provinsi");
        fireEvent.click(provinsi);

        getKabupaten();
        const chooseProvinsi = await screen.findByText("JAWA BARAT");
        fireEvent.click(chooseProvinsi);

        const kota = screen.getByText("Pilih Kota");
        fireEvent.click(kota);

        getKecamatan();
        const chooseKota = await screen.findByText("KOTA BANDUNG");
        fireEvent.click(chooseKota);

        const kecamatan = screen.getByText("Pilih Kecamatan");
        fireEvent.click(kecamatan);

        const chooseKecamatan = await screen.findByText("ANTAPANI");
        fireEvent.click(chooseKecamatan);

        const postalCode = screen.getByPlaceholderText("Masukkan Kode Pos");
        fireEvent.change(postalCode, { target: { value: "40291" } });

        const address = screen.getByPlaceholderText("Masukkan Detail Alamat");
        fireEvent.change(address, { target: { value: "Jalan" } });

        const saveButton = screen.getByText("Simpan");
        fireEvent.click(saveButton);
        
        editProfile();
        fireEvent.click(saveButton);

        await waitFor(() => screen.findByText("Alamat Berhasil Disimpan"));

        const closeIcon = screen.getByTitle("success-close");
        fireEvent.click(closeIcon);
    });

    test("Input form success close with button", async () => {
        getProvinsi();

        renderPage();

        const provinsi = await screen.findByText("Pilih Provinsi");
        fireEvent.click(provinsi);

        getKabupaten();
        const chooseProvinsi = await screen.findByText("JAWA BARAT");
        fireEvent.click(chooseProvinsi);

        const kota = screen.getByText("Pilih Kota");
        fireEvent.click(kota);

        getKecamatan();
        const chooseKota = await screen.findByText("KOTA BANDUNG");
        fireEvent.click(chooseKota);

        const kecamatan = screen.getByText("Pilih Kecamatan");
        fireEvent.click(kecamatan);

        const chooseKecamatan = await screen.findByText("ANTAPANI");
        fireEvent.click(chooseKecamatan);

        const postalCode = screen.getByPlaceholderText("Masukkan Kode Pos");
        fireEvent.change(postalCode, { target: { value: "40291" } });

        const address = screen.getByPlaceholderText("Masukkan Detail Alamat");
        fireEvent.change(address, { target: { value: "Jalan" } });

        editProfile();
        const saveButton = screen.getByText("Simpan");
        fireEvent.click(saveButton);

        await waitFor(() => screen.findByText("Alamat Berhasil Disimpan"));

        const closeButton = screen.getByText("Masuk ke halaman profil mySIIS");
        fireEvent.click(closeButton);
    });

    test("Pick from maps not succeed", async () => {
        getProvinsi();

        vi.useFakeTimers();
        renderPage();

        const chooseMap = await screen.findByText("Pilih di Maps");
        fireEvent.click(chooseMap);

        axios.get.mockRejectedValueOnce({});

        vi.advanceTimersByTime(1000);
    });

    test("Pick from maps initiate", async () => {
        getProvinsi();

        vi.useFakeTimers();
        renderPage();

        const chooseMap = await screen.findByText("Pilih di Maps");
        fireEvent.click(chooseMap);

        getKelurahanByLocation();

        vi.advanceTimersByTime(1000);
    });

    test("Pick from maps on search", async () => {
        getProvinsi();

        vi.useFakeTimers();
        renderPage();

        const chooseMap = await screen.findByText("Pilih di Maps");
        fireEvent.click(chooseMap);

        getKelurahanByLocation();

        vi.advanceTimersByTime(1000);

        const searchInput = screen.getByPlaceholderText("Cari Lokasi");
        fireEvent.change(searchInput, { target: { value: "monas" } });
    });

    test("Pick from maps on click", async () => {
        getProvinsi();

        vi.useFakeTimers();
        renderPage();

        const chooseMap = await screen.findByText("Pilih di Maps");
        fireEvent.click(chooseMap);

        getKelurahanByLocation();

        vi.advanceTimersByTime(1000);

        const saveButton = await screen.findByText("Pilih Alamat");
        fireEvent.click(saveButton);

        const closeModal = screen.getByTitle("modal-close");
        fireEvent.click(closeModal);
    });
});
