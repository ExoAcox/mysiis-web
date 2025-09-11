import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen, user } from "@functions/test";

import SummaryTarget from "@pages/planning/data-demand/target-summary";

import { colorPicker, dataFormat, hexToRgbA, options } from "@features/planning/data-demand/functions/chart";

const renderPage = (args?: { access?: Access }) => {
    const { access = "allowed" } = args || {};

    const view = render(<SummaryTarget user={user} access={access} />);

    return view;
};

const getRegional = () => {
    return axios.get.mockResolvedValueOnce({
        data: { data: ["Regional 1", "Regional 2", "Regional 3"] },
    });
};

const getRespondentByWitel = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: [
                {
                    items: [
                        {
                            treg: "Regional 1",
                            witel: "Witel 1",
                            periode_date: "2012-12-30",
                            status: "status",
                            total: 1,
                        },
                        {
                            treg: "Regional 1",
                            witel: "Witel 1",
                            periode_date: "2012-12-29",
                            status: "status",
                            total: 2,
                        },
                    ],
                    witel: "Witel 1",
                },
                {
                    items: [
                        {
                            treg: "Regional 2",
                            witel: "Witel 2",
                            periode_date: "2012-12-30",
                            status: "status",
                            total: 1,
                        },
                        {
                            treg: "Regional 2",
                            witel: "Witel 2",
                            periode_date: "2012-12-29",
                            status: "status",
                            total: 2,
                        },
                    ],
                    witel: "Witel 2",
                },
                {
                    items: [],
                    witel: "",
                },
            ],
        },
    });
};

const optionsCallback = (options: any, contextDataset: any) => {
    const radius = options?.elements?.point?.radius({ dataIndex: contextDataIndex, dataset: contextDataset });

    return { radius };
};

const dataCallback = (data: any) => {
    const background = data.datasets.map((dataset: any) => {
        const gradient = dataset?.backgroundColor({
            chart: {
                ctx: {
                    createLinearGradient: () => ({
                        addColorStop: () => "rgb",
                    }),
                },
            },
        });

        return gradient;
    });

    return { background };
};

const userWithRegional = {
    uuid: "uuid",
    userId: "id",
    fullname: "John Cena",
    permission_keys: [],
    role_keys: [],
    regional: "Regional 1",
};

const chartData = [
    {
        color: "color",
        data: [{ treg: "Regional 1", witel: "Witel 1", periode_date: "2012-12-30", status: "valid", total: 1 }],
        rgba: "rgba",
        status: true,
        witel: "Witel 1",
    },
];

const periodDate = [new Date("2012-12-30"), new Date("2012-12-29")];

const contextDataIndex = 30;

const contextDataset1 = { data: Array.from(Array(2).keys()) };
const contextDataset2 = { data: Array.from(Array(31).keys()) };

vi.mock("react-date-range");

vi.mock("react-chartjs-2");

describe("Data demand summary target page", () => {
    test("Test snapshot", async () => {
        axios.get.mockResolvedValueOnce({});
        getRegional();
        getRespondentByWitel();

        const view = renderPage();
        view.asFragment();
    });

    test("Summary target test chart not success with custom user", async () => {
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});

        render(<SummaryTarget user={userWithRegional} access={"allowed"} />);

        const tabButtonDetailSummary = screen.getByText("Detail Summary");
        fireEvent.click(tabButtonDetailSummary);

        const tabButtonSummaryTarget = screen.getByText("Summary Target");
        fireEvent.click(tabButtonSummaryTarget);
    });

    test("Summary target test chart not success", async () => {
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});

        renderPage();

        const tabButtonDetailSummary = screen.getByText("Detail Summary");
        fireEvent.click(tabButtonDetailSummary);

        const tabButtonSummaryTarget = screen.getByText("Summary Target");
        fireEvent.click(tabButtonSummaryTarget);
    });

    test("Summary target test chart success", async () => {
        getRegional();
        getRespondentByWitel();

        renderPage();

        const regionalDropdown = await screen.findAllByText("Regional 1");
        fireEvent.click(regionalDropdown[0]);

        getRespondentByWitel();
        const chooseRegionalDropdown = await screen.findByText("Regional 2");
        fireEvent.click(chooseRegionalDropdown);

        getRespondentByWitel();
        const calendarDropdown = await screen.findByTitle("calendar-icon");
        fireEvent.click(calendarDropdown);

        const legendButton = await screen.findByText("Witel 2");
        fireEvent.click(legendButton);
    });

    test("Summary target test chart mobile responsive", async () => {
        getRegional();
        getRespondentByWitel();

        renderPage();

        const filterButton = screen.getByText("Filter");
        fireEvent.click(filterButton);

        const closeIcon = screen.getByTitle("modal-close");
        fireEvent.click(closeIcon);

        fireEvent.click(filterButton);

        getRespondentByWitel();
        const calendarDropdown = await screen.findByTitle("calendar-icon-mobile");
        fireEvent.click(calendarDropdown);

        const regionalDropdown = await screen.findAllByText("Regional 1");
        fireEvent.click(regionalDropdown[1]);

        getRespondentByWitel();
        const chooseRegionalDropdown = await screen.findAllByText("Regional 2");
        fireEvent.click(chooseRegionalDropdown[1]);

        const applyButton = screen.getByText("Terapkan");
        fireEvent.click(applyButton);
    });

    test("Summary target mock colorPicker", async () => {
        const number = Array.from(Array(14).keys());

        number.map((number) => colorPicker(number));
        colorPicker;
    });

    test("Summary target mock hexToRgbA", async () => {
        const hex = ["FFF", "#FFF", "#FFFFFF"];

        hex.map((hex) => hexToRgbA(hex));
    });

    test("Summary target mock options", async () => {
        optionsCallback(options(), contextDataset1);
        optionsCallback(options(), contextDataset2);
    });

    test("Summary target mock dataFormat", async () => {
        dataCallback(dataFormat(chartData, periodDate));
    });
});
