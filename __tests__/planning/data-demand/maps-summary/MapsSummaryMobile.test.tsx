import { googleMaps } from "@exoacox/google-maps-vitest-mocks";
import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen, user } from "@functions/test";

import MapsSummary from "@pages/planning/data-demand/maps-summary";

const renderPage = (args?: { access?: Access; device?: Device }) => {
    const { access = "allowed", device = "mobile" } = args || {};

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

vi.mock("@googlemaps/markerclustererplus");

vi.mock("@hooks/useMediaQuery", () => ({
    default: () => ({ width: 567, isMobile: true }),
}));

googleMaps();

describe("Data demand maps summary page mobile responsive", () => {
    test("Test snapshot", async () => {
        axios.get.mockResolvedValueOnce({});
        axios.get.mockResolvedValueOnce({});
        getKelurahanByLocation();
        getRespondentByValid();

        const view = renderPage();
        view.asFragment();
    });

    test("Data demand maps summary test success", async () => {
        axios.get.mockResolvedValueOnce({});
        getKelurahanByLocation();
        getRespondentByValid();

        renderPage();

        const tabMapType = await screen.findByTitle("map-type-icon");
        fireEvent.click(tabMapType);

        const filterButton = await screen.findByText("Filter");
        fireEvent.click(filterButton);

        const closeIcon = screen.getByTitle("modal-close");
        fireEvent.click(closeIcon);

        fireEvent.click(filterButton);

        const applyButton = screen.getByText("Terapkan");
        fireEvent.click(applyButton);
    });
});
