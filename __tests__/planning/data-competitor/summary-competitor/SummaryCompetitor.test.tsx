import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen, user } from "@functions/test";

import SummaryCompetitor from "@pages/planning/data-competitor/summary-competitor";

const renderPage = (args?: { access?: Access }) => {
    const { access = "allowed" } = args || {};

    vi.useFakeTimers();
    const view = render(<SummaryCompetitor user={user} access={access} />);
    vi.advanceTimersByTime(1500);

    return view;
};

const getRegionalCompetitor = () => {
    return axios.get.mockResolvedValueOnce({
        data: { data: [{ regional: "Regional 1" }, { regional: "Regional 2" }] },
    });
};

const summaryData = [
    {
        regional: "Regional 1",
        witel: "Witel 1",
        wins: 1,
        losses: 1,
        no_competitor: 1,
        total: 2,
    },
    {
        regional: "Regional 2",
        witel: "Witel 2",
        wins: 2,
        losses: 2,
        no_competitor: 2,
        total: 4,
    },
    {
        regional: null,
        witel: null,
        wins: null,
        losses: null,
        no_competitor: null,
        total: null,
    },
];

const getCompetitorSummary = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: summaryData,
        },
    });
};

const getSummaryByRegional = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: summaryData,
        },
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

vi.mock("react-chartjs-2");

describe("Data competitor summary competitor page", () => {
    test("Test snapshot", async () => {
        axios.get.mockResolvedValueOnce({});
        getRegionalCompetitor();
        getCompetitorSummary();
        axios.get.mockResolvedValueOnce({});
        getSummaryByRegional();

        const view = renderPage();
        view.asFragment();
    });

    test("Summary competitor error get data", async () => {
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});

        renderPage();
    });

    test("Summary competitor test", async () => {
        getRegionalCompetitor();
        getCompetitorSummary();
        axios.get.mockResolvedValueOnce({});
        getSummaryByRegional();

        renderPage();

        const tabButtonDetailCompetitor = screen.getByText("Detail Competitor");
        fireEvent.click(tabButtonDetailCompetitor);

        const tabButtonSummaryCompetitor = screen.getAllByText("Summary Competitor");
        fireEvent.click(tabButtonSummaryCompetitor[0]);

        getCompetitorSummary();
        const tabValueWitel = screen.getByText("Witel");
        fireEvent.click(tabValueWitel);

        const dropdownRegional = screen.getAllByText("Semua Regional");
        fireEvent.click(dropdownRegional[0]);

        getCompetitorSummary();
        const chooseDropdownRegional = await screen.findByText("Regional 1");
        fireEvent.click(chooseDropdownRegional);

        fireEvent.click(chooseDropdownRegional);
        getCompetitorSummary();
        fireEvent.click(dropdownRegional[1]);

        getSummaryByRegional();
        const tabValueRegional = screen.getByText("Regional");
        fireEvent.click(tabValueRegional);

        const legend = await screen.findByText("Rekomendasi");
        fireEvent.click(legend);
    });

    test("Summary competitor with user regional", async () => {
        getCompetitorSummary();
        axios.get.mockResolvedValueOnce({});
        getCompetitorSummary();

        vi.useFakeTimers();
        render(<SummaryCompetitor user={userWithRegional} access={"allowed"} />);
        vi.advanceTimersByTime(1500);
    });
});
