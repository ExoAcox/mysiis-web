import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen, user } from "@functions/test";

import Dashboard from "@pages/planning/dashboard-microdemand/dashboard";

const renderPage = async () => {
    const view = render(
        <Dashboard user={{ ...user, regional: "regional", witel: "witel", role_keys: ["admin-survey-regional"] }} device="desktop" />
    );
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
    axios.get.mockResolvedValue({
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
                        status: "valid-mitra",
                    },
                    {
                        id: "id",
                        name: "Survey 2",
                        phone: "080",
                        user: { fullname: "name" },
                        mysista_data: { name: "name", wkt: "POLYGON", lat: 3, lon: 3 },
                        treg: "regional",
                        witel: "witel",
                        sourcename: "vendor",
                        status: "valid-mitra",
                    },
                ],
                filteredCount: 1,
            },
        },
    });
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

        const view = await renderPage();
        view.asFragment();
    });

    test("Open survey evidance detail", async () => {
        axios.get.mockResolvedValueOnce({});
        axios.get.mockResolvedValueOnce({});
        getRegional();
        getWitel();
        getVendor();
        getConfig();
        getSurvey();

        vi.useFakeTimers();
        renderPage();

        // const typeDropdown = screen.getByText("Jenis Survey");
        // fireEvent.click(typeDropdown);
        // const typeOption = await screen.findByText("Survey Evidance Capex");
        // fireEvent.click(typeOption);

        // axios.get.mockResolvedValueOnce({ data: { data: { responses: { lists: [{}] } } } });
        // const surveyList = await screen.findAllByText("Lihat");
        // console.log(surveyList);
        
        // fireEvent.click(surveyList[0]);

        // Validate survey
        // const validateButton = await screen.findByText("Validasi");
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
