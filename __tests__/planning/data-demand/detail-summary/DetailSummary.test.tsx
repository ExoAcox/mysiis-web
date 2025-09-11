import { googleMaps } from "@exoacox/google-maps-vitest-mocks";
import dayjs from "dayjs";
import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen, user, waitFor } from "@functions/test";

import DetailSummary from "@pages/planning/data-demand/detail-summary";

import { fetchDefaultWitel } from "@features/planning/data-demand/functions/table";

const renderPage = (args?: { access?: Access }) => {
    const { access = "allowed" } = args || {};

    vi.useFakeTimers();
    const view = render(<DetailSummary user={user} access={access} />);
    vi.advanceTimersByTime(1000);

    return view;
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

const getRegional = () => {
    return axios.get.mockResolvedValueOnce({
        data: { data: ["Regional 1", "Regional 2"] },
    });
};

const getWitel = () => {
    return axios.get.mockResolvedValueOnce({
        data: { data: ["Witel 1", "Witel 2"] },
    });
};

const userWithRegional = {
    uuid: "uuid",
    userId: "id",
    fullname: "John Cena",
    permission_keys: [],
    role_keys: [],
    regional: "Regional 1",
};

const userWithWitel = {
    uuid: "uuid",
    userId: "id",
    fullname: "John Cena",
    permission_keys: [],
    role_keys: [],
    regional: "Regional 1",
    witel: "Witel 1",
};

googleMaps();

vi.mock("@googlemaps/markerclustererplus");

describe("Data demand detail summary page", () => {
    test("Test snapshot", async () => {
        axios.get.mockResolvedValueOnce({});
        getRegional();
        axios.get.mockResolvedValueOnce({});
        getRespondentByValid();
        getRespondentByValid();

        const view = renderPage();
        view.asFragment();
    });

    test("Data demand detail summary error get data", async () => {
        axios.get.mockRejectedValueOnce({});
        axios.get.mockResolvedValueOnce({});
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});

        renderPage();
    });

    test("Data demand detail summary test error get witel", async () => {
        getRegional();
        axios.get.mockResolvedValueOnce({});
        getRespondentByValid();
        getRespondentByValid();

        renderPage();

        const dropdownRegional = await screen.findAllByText("Regional 1");
        fireEvent.click(dropdownRegional[0]);

        axios.get.mockRejectedValueOnce({});
        const chooseDropdownRegional = await screen.findByText("Regional 2");
        fireEvent.click(chooseDropdownRegional);
    });

    test("Data demand detail summary test success", async () => {
        getRegional();
        axios.get.mockResolvedValueOnce({});
        getRespondentByValid();
        getRespondentByValid();

        renderPage();

        const tabButtonSummaryTarget = screen.getByText("Summary Target");
        fireEvent.click(tabButtonSummaryTarget);

        const tabButtonDetailSummary = screen.getByText("Detail Summary");
        fireEvent.click(tabButtonDetailSummary);

        getRespondentByValid();
        const search = screen.getByPlaceholderText("Nama, telepon, alamat");
        fireEvent.change(search, { target: { value: "John" } });

        getRespondentByValid();
        const resetSearch = screen.getByTitle("reset-search-input");
        fireEvent.click(resetSearch);

        const currentMonth = dayjs().format("MMM YYYY");
        const pastMonth = dayjs().subtract(1, "month").format("MMM YYYY");
        const pastTwoMonth = dayjs().subtract(2, "month").format("MMM YYYY");
        const defaultMonth = `${pastMonth} - ${currentMonth}`;
        const changeMonth = `${pastTwoMonth} - ${pastMonth}`;

        const periodDropdown = await screen.findAllByText(defaultMonth);
        fireEvent.click(periodDropdown[0]);

        getRespondentByValid();
        const choosePeriodDropdown = await screen.findByText(changeMonth);
        fireEvent.click(choosePeriodDropdown);

        const dropdownRegional = await screen.findAllByText("Regional 1");
        fireEvent.click(dropdownRegional[0]);

        vi.useFakeTimers();
        getWitel();
        getRespondentByValid();
        getRespondentByValid();
        getRespondentByValid();
        const chooseDropdownRegional = await screen.findByText("Regional 2");
        fireEvent.click(chooseDropdownRegional);
        vi.advanceTimersByTime(1000);

        getRespondentByValid();
        const dropdownWitel = await screen.findAllByText("Witel 1");
        fireEvent.click(dropdownWitel[0]);

        getRespondentByValid();
        const chooseDropdownWitel = await screen.findByText("Witel 2");
        fireEvent.click(chooseDropdownWitel);

        const dropdownSubscriber = await screen.findByText("Pilih Langganan");
        fireEvent.click(dropdownSubscriber);

        getRespondentByValid();
        const chooseDropdownSubscriber = await screen.findByText("Kurang dari 1 bulan");
        fireEvent.click(chooseDropdownSubscriber);

        const dropdownScale = await screen.findByText("Pilih Skala");
        fireEvent.click(dropdownScale);

        getRespondentByValid();
        const chooseDropdownScale = await screen.findByText("Cenderung Membutuhkan");
        fireEvent.click(chooseDropdownScale);
    });

    test("Data demand detail summary test success table", async () => {
        getRegional();
        axios.get.mockResolvedValueOnce({});
        getRespondentByValid();
        getRespondentByValid();
        getRespondentByValid();
        getRespondentByValid();

        renderPage();

        const detailButton = await screen.findAllByText("Lihat");
        fireEvent.click(detailButton[0]);
        await waitFor(() => screen.findByText("Detail Responden"));

        const closeIcon = await screen.findByTitle("modal-close");
        fireEvent.click(closeIcon);

        fireEvent.click(detailButton[0]);
        await waitFor(() => screen.findByText("Detail Responden"));

        const mapsButton = await screen.findByText("Lihat di Maps");
        fireEvent.click(mapsButton);
    });

    test("Data demand detail summary with user regional", async () => {
        getWitel();
        axios.get.mockResolvedValueOnce({});
        getRespondentByValid();
        getRespondentByValid();

        render(<DetailSummary user={userWithRegional} access={"allowed"} />);
    });

    test("Data demand detail summary with user witel", async () => {
        axios.get.mockResolvedValueOnce({});
        getRespondentByValid();
        getRespondentByValid();

        render(<DetailSummary user={userWithWitel} access={"allowed"} />);
    });

    test("Detail summary mock fetchDefaultWitel", async () => {
        const regionals = ["All", "Regional 1", "Regional 2", "Regional 3", "Regional 4", "Regional 5", "Regional 6", "Regional 7"];

        regionals.map((regional) => fetchDefaultWitel(regional));
    });
});
