import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen, user } from "@functions/test";

import Assignment from "@pages/planning/dashboard-microdemand/assignment";

const renderPage = async (args?: { device: Device }) => {
    const { device = "desktop" } = args || {};

    const view = render(
        <Assignment user={{ ...user, regional: "regional", witel: "witel", role_keys: ["supervisor-survey-mitra"] }} device={device} />
    );
    await vi.dynamicImportSettled();
    return view;
};
const getRegional = () => {
    axios.get.mockResolvedValueOnce({ data: { data: ["regional"] } });
};
const getWitel = () => {
    axios.get.mockResolvedValueOnce({ data: { data: ["witel"] } });
};
const getVendor = () => {
    axios.get.mockResolvedValueOnce({ data: { data: ["vendor"] } });
};
const getPolygon = () => {
    axios.get.mockResolvedValueOnce({ data: { data: [{ name: "polygon", objectid: "id" }] } });
};
const getUser = () => {
    axios.get.mockResolvedValueOnce({ data: { data: { lists: [{ userId: "id", fullname: "User 1" }], totalCount: 1 } } });
};
const getSurveyor = () => {
    axios.get.mockResolvedValueOnce({
        data: {
            data: {
                lists: [
                    {
                        detail: {
                            account: {},
                            mysista: {},
                        },
                        is_active: "N",
                    },
                    {
                        detail: {
                            account: {},
                            mysista: {},
                        },
                        is_active: "Y",
                    },
                ],
                filteredCount: 1,
            },
        },
    });
};

describe("Assigment microdemand page", () => {
    test("Test snapshot", async () => {
        getRegional();
        getWitel();
        getVendor();
        getSurveyor();
        getUser();
        getPolygon();

        const view = await renderPage();
        view.asFragment();
    });

    // test("Activate user", async () => {
    //     getSurveyor();
    //     getUser();
    //     getPolygon();
    //     getRegional();
    //     getSurveyor();
    //     getVendor();

    //     renderPage();

    //     const activeSurvey = await screen.findByText("Aktifkan");
    //     fireEvent.click(activeSurvey);

    //     axios.post.mockResolvedValueOnce({ data: { data: {} } });
    //     const activateButton = await screen.findAllByText("Aktifkan");
    //     fireEvent.click(activateButton[1]);

    //     const activateClose = await screen.findByText("Oke");
    //     fireEvent.click(activateClose);

    //     const nonActiveSurvey = await screen.findByText("Non-aktifkan");
    //     fireEvent.click(nonActiveSurvey);

    //     axios.post.mockResolvedValueOnce({ data: { data: {} } });
    //     const nonActivateButton = await screen.findAllByText("Non-aktifkan");
    //     fireEvent.click(nonActivateButton[1]);

    //     const nonActivateClose = await screen.findByText("Oke");
    //     fireEvent.click(nonActivateClose);
    // });

    // test("Add assignment", async () => {
    //     getSurveyor();
    //     getUser();
    //     getPolygon();
    //     getRegional();
    //     getSurveyor();
    //     getVendor();

    //     renderPage();

    //     const addButton = screen.getByText("Tambah Assignment");
    //     fireEvent.click(addButton);

    //     const surveyorDropdown = screen.getByText("Pilih Surveyor");
    //     fireEvent.click(surveyorDropdown);

    //     const surveyorOption = await screen.findAllByText("User 1");
    //     fireEvent.click(surveyorOption[1]);

    //     const selectPolygon = screen.getByText("+ Pilih Polygon");
    //     fireEvent.click(selectPolygon);

    //     const searchPolygon = screen.getByPlaceholderText("Cari polygon ...");
    //     fireEvent.change(searchPolygon, { target: { value: "polygon" } });

    //     const checkboxValue = screen.getAllByText("polygon")[1];
    //     fireEvent.click(checkboxValue);

    //     const saveButton = screen.getByText("Simpan");
    //     fireEvent.click(saveButton);

    //     const saveButton2 = screen.getByText("Tambah");
    //     fireEvent.click(saveButton2);
    // });

    test("Mobile device", () => {
        getSurveyor();
        getUser();
        getPolygon();
        getRegional();
        getSurveyor();
        getVendor();

        renderPage({ device: "mobile" });
    });
});
