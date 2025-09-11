import { Map, googleMaps } from "@exoacox/google-maps-vitest-mocks";
import React from "react";
import { test, vi } from "vitest";

import { axios, fireEvent, render, screen, user } from "@functions/test";

import MySissta from "@pages/planning/mysiista";

import { useBodyStore, useListSurveyor } from "@features/planning/mysiista/store/drawing";

beforeAll(() => {
    googleMaps();
    Map({ getZoom: vi.fn(() => 20) });
});

const dataKelurahan = {
    st_name: "string",
    kode_desa_dagri: "string",
    kelurahan: "string",
    kecamatan: "string",
    kota: "string",
    provinsi: "string",
    regional: "string",
    witel: "string",
    geom: "POLYGON ((-3.706512451171875 40.420074462890625, -3.70513916015625 40.420074462890625, -3.70513916015625 40.42144775390625, -3.706512451171875 40.42144775390625, -3.706512451171875 40.420074462890625))",
};

const dataOdpUim = [
    {
        device_id: 3,
        devicename: "string",
        lat: 3,
        long: 3,
        status_occ_add: "red",
        portidlenumber: "20",
        deviceportnumber: "20",
        odp: "string",
        updated_mysiis: "string",
        networklocationcode: "string",
        code_sto: "string",
        portinservicenumber: 3,
        odp_install: "string",
    },
];

const dataPolygonMycrodemand = [
    {
        attributes: {},
        geometry: {
            rings: [
                [
                    {
                        lat: 3,
                        lng: 3,
                    },
                ],
            ],
        },
    },
];
const dataMycrodemand = [
    {
        attributes: {},
        geometry: { x: 3, y: 3 },
    },
];

const getKelurahanByLocation = () => axios.get.mockResolvedValueOnce({ data: { data: dataKelurahan } });
const getOdp = () => axios.get.mockResolvedValueOnce({ data: { data: dataOdpUim } });
const generateToken = () => axios.post.mockResolvedValueOnce({ data: { data: { token: "token" } } });
const getPolygonMicrodemand = () => axios.post.mockResolvedValueOnce({ data: { features: dataPolygonMycrodemand } });
const getDataMicrodemand = () => axios.post.mockResolvedValueOnce({ data: { features: dataMycrodemand } });
const addPolygon = () => axios.post.mockResolvedValueOnce({ data: { status: "success", code: 200 } });

describe("MySiista Pages", () => {
    test("Snapshoot MySiista", () => {
        vi.useFakeTimers();
        render(<MySissta user={user} device={"desktop"} access={"allowed"} />).asFragment();
        vi.advanceTimersByTime(1000);
    });

    test("should fetch data", async () => {
        vi.useFakeTimers();
        render(<MySissta user={user} device={"desktop"} access={"allowed"} />).asFragment();
        getKelurahanByLocation();
        getOdp();
        generateToken();
        vi.advanceTimersByTime(1000);
        getPolygonMicrodemand();
        getDataMicrodemand();
        addPolygon();
        // useOdpPercentStore.setState({ status: 'resolve', odp_precent: '1 ODP UIM (100)%' })

        const btnDraw = await screen.findByText("Gambar Polygon");
        fireEvent.click(btnDraw);

        useBodyStore.setState({
            body: {
                tahap_survey: "14",
                name: "",
                prioritas: 1,
                treg: "REGIONAL 2",
                witel: "JAKBAR",
                id_desa: "2",
                street: "Jl Tomang",
                address: "Jl Tomang",
                postal: "11430",
                desa: "2324234",
                kecamatan: "PAL MERAH",
                kabupaten: "JAKARTA BARAT",
                provinsi: "DKI JAKARTA",
                lat: -6.177901801545182,
                lon: 106.7991208527911,
                keterangan: "",
                surveyor: "",
                target_household: "",
                user: "username",
            },
        });

        const name = screen.getByPlaceholderText("Masukan nama");
        fireEvent.change(name, { target: { value: "username" } });

        useListSurveyor.setState({ list: [{ label: "Telkom", value: "Telkom" }] });
        const dropdown_surveyor = screen.getByText("Pilih Surveyor");
        fireEvent.click(dropdown_surveyor);
        const surveyor = screen.getByText("Telkom");
        fireEvent.click(surveyor);
        const keterangan = screen.getByPlaceholderText("Masukan keterangan");
        fireEvent.change(keterangan, { target: { value: "keterangan" } });
        const target = screen.getByPlaceholderText("masukan target houshold");
        fireEvent.change(target, { target: { value: "20" } });

        const btnSimpan = screen.getByText("Simpan");
        fireEvent.click(btnSimpan);

        const btnBatal = screen.getByText("Batal");
        fireEvent.click(btnBatal);
    });
});
