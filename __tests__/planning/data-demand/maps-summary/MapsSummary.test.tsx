import { googleMaps } from "@exoacox/google-maps-vitest-mocks";
import dayjs from "dayjs";
import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen, user, waitFor } from "@functions/test";

import MapsSummary from "@pages/planning/data-demand/maps-summary";

import { customClustererIcon } from "@features/planning/data-demand/functions/maps";
import { filterOdpView } from "@features/planning/data-demand/functions/odpView";

const renderPage = (args?: { access?: Access; device?: Device }) => {
    const { access = "allowed", device = "desktop" } = args || {};

    vi.useFakeTimers();
    const view = render(<MapsSummary user={user} access={access} device={device} />);
    vi.advanceTimersByTime(1000);

    return view;
};

const getKelurahanByLocation = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: {
                st_name: "st_name",
                kode_desa_dagri: "kode_desa_dagri",
                kelurahan: "kelurahan",
                kecamatan: "kecamatan",
                kota: "kota",
                provinsi: "provinsi",
                regional: "Regional 1",
                witel: "Witel 1",
                geom: "geom",
            },
        },
    });
};

const getRespondentByValidValues = {
    id: 1,
    latitude: "1",
    longitude: "1",
    name: "John",
    phone: "string",
    address: "string",
    conf_scale_of_need_value: "string",
    conf_subscribe_plans_value: "string",
    count_odp_ready: "string",
    survey_at: "string",
    photo: "string",
    conf_kepemilikan_rumah_value: "string",
    conf_pekerjaan_value: "string",
    conf_communication_expenses_value: "string",
    conf_providers_value: "string",
    conf_pln_kwhid: 1,
    conf_pln_kwh_value: "string",
    keterangan: "string",
    pln_id: "string",
    invalid_reason: "string",
    valid_reason: "string",
    valid_reason_mitra: "string",
};

const getRespondentByValidValuesNull = {
    id: null,
    latitude: null,
    longitude: null,
    name: "name",
    phone: null,
    address: null,
    conf_scale_of_need_value: null,
    conf_subscribe_plans_value: null,
    count_odp_ready: null,
    survey_at: null,
    photo: null,
    conf_kepemilikan_rumah_value: null,
    conf_pekerjaan_value: null,
    conf_communication_expenses_value: null,
    conf_providers_value: null,
    conf_pln_kwhid: null,
    conf_pln_kwh_value: null,
    keterangan: null,
    pln_id: null,
    invalid_reason: null,
    valid_reason: null,
    valid_reason_mitra: null,
};

const getRespondentByValid = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: {
                lists: [
                    { ...getRespondentByValidValues, conf_scale_of_needid: 10 },
                    { ...getRespondentByValidValues, conf_scale_of_needid: 11 },
                    { ...getRespondentByValidValues, conf_scale_of_needid: 12 },
                    { ...getRespondentByValidValues, conf_scale_of_needid: 0 },
                    { ...getRespondentByValidValuesNull, conf_scale_of_needid: 10 },
                ],
                filteredCount: 5,
            },
        },
    });
};

const getOdp = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: [
                {
                    device_id: 1,
                    devicename: "string",
                    lat: 1,
                    long: 1,
                    status_occ_add: "GREEN",
                    portidlenumber: "string",
                    deviceportnumber: "string",
                    odp: "string",
                    updated_mysiis: "string",
                    networklocationcode: "string",
                    code_sto: "string",
                    portinservicenumber: 1,
                    odp_install: "string",
                },
            ],
        },
    });
};

vi.mock("@googlemaps/markerclustererplus");

googleMaps();

describe("Data demand maps summary page", () => {
    test("Test snapshot", async () => {
        axios.get.mockResolvedValueOnce({});
        axios.get.mockResolvedValueOnce({});
        getKelurahanByLocation();
        getRespondentByValid();

        const view = renderPage();
        view.asFragment();
    });

    test("Data demand maps summary error get data", async () => {
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});

        renderPage();
    });

    test("Data demand maps summary test error", async () => {
        axios.get.mockResolvedValueOnce({});
        getKelurahanByLocation();
        axios.get.mockRejectedValueOnce({ response: { data: { code: 404 } } });

        renderPage();

        const tabButtonDetailSummary = screen.getByText("Detail Summary");
        fireEvent.click(tabButtonDetailSummary);

        const tabButtonMapsSummary = screen.getByText("Maps Summary");
        fireEvent.click(tabButtonMapsSummary);

        const setFilterActive = await screen.findByText("Atur Filter");
        fireEvent.click(setFilterActive);
        fireEvent.click(setFilterActive);

        const currentMonth = dayjs().format("MMMM YYYY");
        const pastMonth = dayjs().subtract(1, "month").format("MMMM YYYY");
        const pastTwoMonth = dayjs().subtract(2, "month").format("MMMM YYYY");
        const defaultMonth = `${pastMonth} - ${currentMonth}`;
        const changeMonth = `${pastTwoMonth} - ${pastMonth}`;

        const periodDropdown = await screen.findAllByText(defaultMonth);
        fireEvent.click(periodDropdown[0]);

        getKelurahanByLocation();
        axios.get.mockRejectedValueOnce({ response: { data: { code: 471 } } });
        const choosePeriodDropdown = await screen.findByText(changeMonth);
        fireEvent.click(choosePeriodDropdown);
    });

    test("Data demand maps summary test success", async () => {
        axios.get.mockResolvedValueOnce({});
        getKelurahanByLocation();
        getRespondentByValid();

        renderPage();

        const tabButtonDetailSummary = screen.getByText("Detail Summary");
        fireEvent.click(tabButtonDetailSummary);

        const tabButtonMapsSummary = screen.getByText("Maps Summary");
        fireEvent.click(tabButtonMapsSummary);

        const setFilterActive = await screen.findByText("Atur Filter");
        fireEvent.click(setFilterActive);
        fireEvent.click(setFilterActive);

        const currentMonth = dayjs().format("MMMM YYYY");
        const pastMonth = dayjs().subtract(1, "month").format("MMMM YYYY");
        const pastTwoMonth = dayjs().subtract(2, "month").format("MMMM YYYY");
        const defaultMonth = `${pastMonth} - ${currentMonth}`;
        const changeMonth = `${pastTwoMonth} - ${pastMonth}`;

        const periodDropdown = await screen.findAllByText(defaultMonth);
        fireEvent.click(periodDropdown[0]);

        getKelurahanByLocation();
        getRespondentByValid();
        const choosePeriodDropdown = await screen.findByText(changeMonth);
        fireEvent.click(choosePeriodDropdown);

        await waitFor(() => screen.findByText("View ODP"));

        getOdp();
        axios.get.mockResolvedValueOnce({});
        getOdp();
        const setViewOdp = await screen.findByText("View ODP");
        fireEvent.click(setViewOdp);
        fireEvent.click(setViewOdp);

        const setScale = await screen.findByText("Cenderung Membutuhkan");
        fireEvent.click(setScale);
        fireEvent.click(setScale);

        const openScale = await screen.findByText("Cenderung membutuhkan");
        fireEvent.click(openScale);

        await waitFor(() => screen.findByText("Detail Responden"));

        const closeIcon = await screen.findByTitle("modal-close");
        fireEvent.click(closeIcon);

        fireEvent.click(openScale);

        const search = screen.getByPlaceholderText("Masukkan Nama yang Anda cari");
        fireEvent.change(search, { target: { value: "John" } });

        const openMaps = await screen.findAllByText("Lihat di Maps");
        fireEvent.click(openMaps[0]);
    });

    test("Data demand maps summary test access unauthorized", () => {
        renderPage({ access: "unauthorized" });
    });

    test("Data demand maps summary customClustererIcon", () => {
        customClustererIcon("color");
    });

    test("Data demand maps summary filterOdpView", () => {
        filterOdpView(["ready", "nearby", "boundary"]);
    });
});
