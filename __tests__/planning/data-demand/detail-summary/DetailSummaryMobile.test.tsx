import { googleMaps } from "@exoacox/google-maps-vitest-mocks";
import dayjs from "dayjs";
import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen, user, waitFor } from "@functions/test";

import DetailSummary from "@pages/planning/data-demand/detail-summary";

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

googleMaps();

vi.mock("@googlemaps/markerclustererplus");

vi.mock("@hooks/useMediaQuery", () => ({
    default: () => ({ width: 567, isMobile: true }),
}));

describe("Data demand detail summary page mobile responsive", () => {
    test("Test", async () => {
        axios.get.mockResolvedValueOnce({});
        getRegional();
        axios.get.mockResolvedValueOnce({});
        getRespondentByValid();
        getRespondentByValid();

        renderPage();
    });

    test("Detail summary error get data mobile", async () => {
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});

        renderPage();
    });

    test("Data demand detail summary success", async () => {
        getRegional();
        axios.get.mockResolvedValueOnce({});
        getRespondentByValid();
        getRespondentByValid();

        renderPage();

        getWitel();
        const filterButton = await screen.findByText("Filter");
        fireEvent.click(filterButton);
        await waitFor(() => screen.findByTestId("filter-table-mobile-modal"));

        const closeIcon = screen.getByTitle("modal-close");
        fireEvent.click(closeIcon);

        fireEvent.click(filterButton);
        await waitFor(() => screen.findByTestId("filter-table-mobile-modal"));

        const currentMonth = dayjs().format("MMM YYYY");
        const pastMonth = dayjs().subtract(1, "month").format("MMM YYYY");
        const pastTwoMonth = dayjs().subtract(2, "month").format("MMM YYYY");
        const defaultMonth = `${pastMonth} - ${currentMonth}`;
        const changeMonth = `${pastTwoMonth} - ${pastMonth}`;

        const periodDropdown = await screen.findAllByText(defaultMonth);
        fireEvent.click(periodDropdown[1]);

        const choosePeriodDropdown = await screen.findAllByText(changeMonth);
        fireEvent.click(choosePeriodDropdown[1]);

        const dropdownRegional = await screen.findAllByText("Regional 1");
        fireEvent.click(dropdownRegional[1]);

        vi.useFakeTimers();
        getWitel();
        getRespondentByValid();
        getRespondentByValid();
        const chooseDropdownRegional = await screen.findAllByText("Regional 2");
        fireEvent.click(chooseDropdownRegional[1]);
        vi.advanceTimersByTime(1000);

        getRespondentByValid();
        const dropdownWitel = await screen.findAllByText("Witel 1");
        fireEvent.click(dropdownWitel[0]);

        getRespondentByValid();
        const chooseDropdownWitel = await screen.findAllByText("Witel 2");
        fireEvent.click(chooseDropdownWitel[1]);

        const dropdownSubscriber = await screen.findAllByText("Pilih Langganan");
        fireEvent.click(dropdownSubscriber[1]);

        getRespondentByValid();
        const chooseDropdownSubscriber = await screen.findByText("Kurang dari 1 bulan");
        fireEvent.click(chooseDropdownSubscriber);

        const dropdownScale = await screen.findAllByText("Pilih Skala");
        fireEvent.click(dropdownScale[1]);

        getRespondentByValid();
        const chooseDropdownScale = await screen.findByText("Cenderung Membutuhkan");
        fireEvent.click(chooseDropdownScale);

        const applyButton = screen.getByText("Terapkan");
        fireEvent.click(applyButton);

        const detailButton = await screen.findAllByText("Lihat Detail");
        fireEvent.click(detailButton[0]);
    });
});
