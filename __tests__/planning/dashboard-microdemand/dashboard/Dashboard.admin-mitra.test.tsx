import { googleMaps } from "@exoacox/google-maps-vitest-mocks";
import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen, user } from "@functions/test";

import Dashboard from "@pages/planning/dashboard-microdemand/dashboard";

const renderPage = async (args?: { device: Device }) => {
    const { device = "desktop" } = args || {};

    const view = render(<Dashboard user={{ ...user, regional: "regional", witel: "witel", role_keys: ["admin-survey-mitra"] }} device={device} />);
    await vi.dynamicImportSettled();
    return view;
};

const getRegional = () => {
    axios.get.mockResolvedValueOnce({ data: { data: [] } });
};
const getWitel = () => {
    axios.get.mockResolvedValueOnce({ data: { data: [] } });
};
const getVendor = () => {
    axios.get.mockResolvedValueOnce({ data: { data: [] } });
};
const getSurvey = () => {
    axios.get.mockResolvedValueOnce({
        data: {
            data: {
                lists: [
                    {
                        id: "id",
                        name: "Survey 1",
                        phone: "080",
                        user: { fullname: "name" },
                        mysista_data: { name: "name", wkt: "POLYGON", lat: 3, lon: 3 },
                        treg: "regional",
                        witel: "witel",
                        sourcename: "vendor",
                        status: "unvalidated",
                    },
                    {
                        id: "id",
                        name: "Survey 2",
                        phone: "080",
                        user: { fullname: "name" },
                        mysista_data: { name: "name" },
                        treg: "regional",
                        witel: "witel",
                        sourcename: "vendor",
                        status: "unvalidated",
                    },
                ],
                filteredCount: 1,
            },
        },
    });
};

const getUser = () => {
    axios.get.mockResolvedValueOnce({ data: { data: { lists: [], totalCount: 0 } } });
};

const getConfig = () => {
    axios.get.mockResolvedValueOnce({ data: { data: { config_value: "2012-01-01" } } });
    axios.get.mockResolvedValueOnce({ data: { data: { config_value: "2212-01-01" } } });
};

describe("Dashboard microdemand page", () => {
    test("Test snapshot", async () => {
        axios.get.mockResolvedValueOnce({});
        axios.get.mockResolvedValueOnce({});
        getWitel();
        getVendor();
        getSurvey();
        getUser();

        const view = await renderPage();
        view.asFragment();
    });

    test("Open survey detail", async () => {
        axios.get.mockResolvedValueOnce({});
        axios.get.mockResolvedValueOnce({});
        getRegional();
        getWitel();
        getConfig();
        getVendor();
        getSurvey();
        getUser();

        vi.useFakeTimers();
        renderPage();

        // axios.get.mockResolvedValueOnce({ data: { data: { filteredCount: 1 } } });
        // const surveyList = await screen.findAllByText("Lihat");
        // fireEvent.click(surveyList[0]);

        // Open image
        // const imageButton = screen.getByText("Lihat Foto");
        // fireEvent.click(imageButton);

        // Open survey result
        // axios.get.mockResolvedValueOnce({ data: { data: { responses: { lists: [{}] } } } });
        // const resultButton = screen.getByText("Hasil Survey");
        // fireEvent.click(resultButton);

        // const resultClose = screen.getAllByTitle("modal-close")[1];
        // fireEvent.click(resultClose);

        // Open maps
        // axios.get.mockResolvedValueOnce({ data: { data: { lists: [{ latitude: "3", longitude: "3" }] } } });
        // const mapsButton = screen.getByText("Lihat di Maps");
        // fireEvent.click(mapsButton);

        // googleMaps();
        // vi.advanceTimersByTime(1000);

        // const mapsClose = screen.getAllByTitle("modal-close")[1];
        // fireEvent.click(mapsClose);

        // Open duplicate phone
        // axios.get.mockResolvedValueOnce({ data: { data: { lists: [{ user: { fullname: "name" }, status: "UNVALIDATED" }] } } });
        // const phoneButton = await screen.findByText("Lihat Duplikat No. HP (1)");
        // fireEvent.click(phoneButton);

        // const phoneClose = screen.getAllByTitle("modal-close")[1];
        // fireEvent.click(phoneClose);

        // Validate survey
        // const validateButton = screen.getByText("Validasi");
        // fireEvent.click(validateButton);

        // axios.post.mockResolvedValueOnce({ data: { data: {} } });
        // const validateExecButton = screen.getByText("Terima");
        // fireEvent.click(validateExecButton);

        // const validateSuccessButton = await screen.findByText("Berhasil Memverifikasi Survey");
        // fireEvent.click(validateSuccessButton);

        // Decline Survey
        // fireEvent.click(surveyList[1]);

        // const declineButton = screen.getAllByText("Tolak");
        // fireEvent.click(declineButton[0]);

        // const declineInput = screen.getByPlaceholderText("Masukkan alasan kenapa menolak survey ini.");
        // fireEvent.change(declineInput, { target: { value: "Bad" } });

        // axios.post.mockResolvedValueOnce({ data: { data: {} } });
        // const declineButton2 = screen.getAllByText("Tolak");
        // fireEvent.click(declineButton2[1]);

        // const declineSuccessButton = await screen.findByText("Berhasil Menolak Survey");
        // fireEvent.click(declineSuccessButton);

        // Trigger close modal event
        // const modal = screen.getAllByTestId("modal")[0];
        // const closeButton = screen.getAllByTitle("modal-close")[0];
        // fireEvent.transitionEnd(modal);
        // fireEvent.click(closeButton);
    });
});

describe("Dashboard microdemand mobile page", () => {
    test("Test snapshot", async () => {
        axios.get.mockResolvedValueOnce({});
        axios.get.mockResolvedValueOnce({});
        getSurvey();
        getSurvey();
        getSurvey();
        getSurvey();
        getSurvey();

        const view = await renderPage({ device: "mobile" });
        view.asFragment();
    });
});
