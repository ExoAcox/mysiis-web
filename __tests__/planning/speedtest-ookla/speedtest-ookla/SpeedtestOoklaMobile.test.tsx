import { googleMaps } from "@exoacox/google-maps-vitest-mocks";
import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen, user, waitFor } from "@functions/test";

import SpeedtestOokla from "@pages/planning/speedtest-ookla/speedtest-ookla";

vi.mock("react-date-range");

const renderPage = async (args?: { device?: Device; access?: Access }) => {
    const { device = "mobile", access = "allowed" } = args || {};

    vi.useFakeTimers();
    const view = render(<SpeedtestOokla user={user} access={access} device={device} />);
    vi.advanceTimersByTime(1000);

    await vi.dynamicImportSettled();

    return view;
};

const getKelurahanByLocation = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: {
                st_name: "name",
                kode_desa_dagri: "kode",
                kelurahan: "kelurahan",
                kecamatan: "kecamatan",
                kota: "kota",
                provinsi: "profinsi",
                regional: "regional",
                witel: "witel",
                geom: "POLYGON",
            },
        },
    });
};

const getOoklaByKelurahan = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: {
                lists: [{
                    brand: "string",
                    client_city: "string",
                    client_latitude: 0,
                    client_longitude: 0,
                    client_region_name: "string",
                    device_id: "string",
                    download_kbps: "string",
                    ds: "string",
                    flagging_isp: "string",
                    geohash_loc: "string",
                    geom: "string",
                    isp_name: "string",
                    latency: 0,
                    network_operator_name: "string",
                    server_latitude: 0,
                    server_longitude: 0,
                    server_name: "string",
                    source: "string",
                    test_id: "string",
                    treg: "string",
                    upload_kbps: "string",
                    witel: "string",
                }], 
                total_count: 0,
            }
        }
    })
};

const getOoklaByCoordinate = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: {
                lists: [{
                    brand: "string",
                    client_city: "string",
                    client_latitude: 0,
                    client_longitude: 0,
                    client_region_name: "string",
                    device_id: "string",
                    download_kbps: "string",
                    ds: "string",
                    flagging_isp: "string",
                    geohash_loc: "string",
                    geom: "string",
                    isp_name: "string",
                    latency: 0,
                    network_operator_name: "string",
                    server_latitude: 0,
                    server_longitude: 0,
                    server_name: "string",
                    source: "string",
                    test_id: "string",
                    treg: "string",
                    upload_kbps: "string",
                    witel: "string",
                }], 
                total_count: 0,
            }
        }
    });
};

googleMaps();

describe("Speedtest Ookla page", () => {
    test("Test snapshot", async () => {
        getKelurahanByLocation();

        const view = await renderPage();
        view.asFragment();
    });

    test("Get speedtest ookla reject", async () => {
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});

        renderPage();

        await waitFor(() => screen.findByText("Terjadi Kesalahan"));
    });

    test("Filter tab button", async () => {
        getKelurahanByLocation();

        renderPage();

        const tabMapType = await screen.findByTitle("map-type-icon");
        fireEvent.click(tabMapType);

        const filterButton = await screen.findByText("Filter");
        fireEvent.click(filterButton);

        getOoklaByKelurahan();
        const kelurahanFilterButton = screen.getByText("Kelurahan");
        fireEvent.click(kelurahanFilterButton);

        getOoklaByCoordinate();
        const radiusFilterButton = await screen.findAllByText("Radius");
        fireEvent.click(radiusFilterButton[0]);
    });

    test("Date picker", async () => {
        getKelurahanByLocation();
        getOoklaByCoordinate();

        renderPage();

        const filterButton = await screen.findByText("Filter");
        fireEvent.click(filterButton);

        const calendarButton = await screen.findByTitle("icon-calendar");
        fireEvent.click(calendarButton);
    });

    test("Radius", async () => {
        getKelurahanByLocation();
        getOoklaByCoordinate();

        renderPage();

        const filterButton = await screen.findByText("Filter");
        fireEvent.click(filterButton);

        const inputRadius = await screen.findByTestId("slider");
        fireEvent.change(inputRadius, { target: { value: "100" } });

        const pinButton = await screen.findByTitle("speedtest-pin");
        fireEvent.click(pinButton);

        const modalButton = await screen.findByTitle("speedtest-modal");
        fireEvent.click(modalButton);
    });
});