import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen, user, waitFor } from "@functions/test";

import DetailCompetitor from "@pages/planning/data-competitor/detail-competitor";

import { exportCsv, getOverallMatch, getStatusOcc } from "@features/planning/data-competitor/functions/table";

const renderPage = (args?: { access?: Access }) => {
    const { access = "allowed" } = args || {};

    vi.useFakeTimers();
    const view = render(<DetailCompetitor user={user} access={access} />);
    vi.advanceTimersByTime(1000);

    return view;
};

const listAllCompetitor = Array.from({ length: 11 }, (_, index) => {
    return {
        device_id: index,
        devicename: `devicename ${index}`,
        regional: `Regional ${index}`,
        stoname: `stoname ${index}`,
        status_occ: `status_occ ${index}`,
        witel: `Witel ${index}`,
        latency_competitor_avg_ms: index,
        latency_competitor_min_ms: index,
        latency_telkom_avg_ms: index,
        latency_telkom_max_ms: index,
        latency_telkom_min_ms: index,
        overall_match: `overall_match ${index}`,
        provider: `provider ${index}`,
        competitor_speed: index,
        competitor_price: index,
        telkom_pkg_speed_flag: `telkom_pkg_speed_flag ${index}`,
        telkom_pkg_speed_internet_price: index,
        competitor_count_diff: index,
        competitor_latency_diff: index,
        competitor_price_diff: index,
        lat: index,
        long: index,
    };
});

const getAllCompetitor = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: [
                ...listAllCompetitor,
                {
                    device_id: null,
                    devicename: null,
                    regional: null,
                    stoname: null,
                    status_occ: null,
                    witel: null,
                    latency_competitor_avg_ms: null,
                    latency_competitor_min_ms: null,
                    latency_telkom_avg_ms: null,
                    latency_telkom_max_ms: null,
                    latency_telkom_min_ms: null,
                    overall_match: null,
                    provider: null,
                    competitor_speed: null,
                    competitor_price: null,
                    telkom_pkg_speed_flag: null,
                    telkom_pkg_speed_internet_price: null,
                    competitor_count_diff: null,
                    competitor_latency_diff: null,
                    competitor_price_diff: null,
                    lat: null,
                    long: null,
                },
            ],
            meta: { all_data: 11, max_page: 2 },
        },
    });
};

const getRegionalCompetitor = () => {
    return axios.get.mockResolvedValueOnce({
        data: { data: [{ regional: "Regional 1" }, { regional: "Regional 2" }] },
    });
};

const getWitelCompetitor = () => {
    return axios.get.mockResolvedValueOnce({
        data: { data: [{ witel: "Witel 1" }, { witel: "Witel 2" }] },
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

vi.mock("json-to-csv-export");

describe("Data competitor detail competitor page", () => {
    test("Test snapshot", async () => {
        axios.get.mockResolvedValueOnce({});
        getRegionalCompetitor();
        axios.get.mockResolvedValueOnce({});
        getAllCompetitor();
        getAllCompetitor();

        const view = renderPage();
        view.asFragment();
    });

    test("Detail competitor error get data", async () => {
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});

        renderPage();
    });

    // test("Detail competitor filter get data", async () => {
    //     getRegionalCompetitor();
    //     axios.get.mockResolvedValueOnce({});
    //     getAllCompetitor();
    //     getAllCompetitor();

    //     renderPage();

    //     const tabButtonSummaryCompetitor = screen.getByText("Summary Competitor");
    //     fireEvent.click(tabButtonSummaryCompetitor);

    //     const tabButtonDetailCompetitor = screen.getByText("Detail Competitor");
    //     fireEvent.click(tabButtonDetailCompetitor);

    //     getAllCompetitor();
    //     const search = screen.getByPlaceholderText("Cari ID Device");
    //     fireEvent.change(search, { target: { value: "1" } });

    //     getAllCompetitor();
    //     const resetSearch = screen.getByTestId("reset-search-id-device");
    //     fireEvent.click(resetSearch);

    //     const dropdownRegional = await screen.findAllByText("Semua Regional");
    //     fireEvent.click(dropdownRegional[0]);
    //     getWitelCompetitor();
    //     getAllCompetitor();
    //     const chooseDropdownRegional = await screen.findByText("Regional 1");
    //     fireEvent.click(chooseDropdownRegional);

    //     fireEvent.click(chooseDropdownRegional);
    //     getAllCompetitor();
    //     fireEvent.click(dropdownRegional[1]);

    //     fireEvent.click(dropdownRegional[0]);
    //     getWitelCompetitor();
    //     getAllCompetitor();
    //     fireEvent.click(chooseDropdownRegional);

    //     const dropdownWitel = await screen.findAllByText("Pilih Witel");
    //     fireEvent.click(dropdownWitel[0]);
    //     getAllCompetitor();
    //     const chooseDropdownWitel = await screen.findByText("Witel 1");
    //     fireEvent.click(chooseDropdownWitel);

    //     fireEvent.click(chooseDropdownWitel);
    //     getAllCompetitor();
    //     const dropdownWitelAll = await screen.findByText("Semua Witel");
    //     fireEvent.click(dropdownWitelAll);

    //     fireEvent.click(dropdownWitel[0]);
    //     getAllCompetitor();
    //     fireEvent.click(chooseDropdownWitel);

    //     const dropdownStatus = await screen.findAllByText("Semua Status");
    //     fireEvent.click(dropdownStatus[0]);
    //     getAllCompetitor();
    //     const chooseDropdownStatus = await screen.findByText("Rekomendasi");
    //     fireEvent.click(chooseDropdownStatus);

    //     const buttonDetail = await screen.findAllByText("Lihat");
    //     fireEvent.click(buttonDetail[0]);
    // });

    test("Detail competitor table data", async () => {
        getRegionalCompetitor();
        axios.get.mockResolvedValueOnce({});
        getAllCompetitor();
        getAllCompetitor();

        renderPage();

        const choosePagination = await screen.findAllByText("2");
        fireEvent.click(choosePagination[0]);
    });

    test("Detail competitor with user regional error get data", async () => {
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});

        render(<DetailCompetitor user={userWithRegional} access={"allowed"} />);
    });

    test("Detail competitor with user regional get data", async () => {
        getWitelCompetitor();
        axios.get.mockResolvedValueOnce({});
        getAllCompetitor();
        getAllCompetitor();

        render(<DetailCompetitor user={userWithRegional} access={"allowed"} />);
        await waitFor(() => null);
    });

    test("Detail competitor with user witel error get data", async () => {
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});

        render(<DetailCompetitor user={userWithWitel} access={"allowed"} />);
        await waitFor(() => null);
    });

    test("Detail competitor with user witel get data", async () => {
        axios.get.mockResolvedValueOnce({});
        getAllCompetitor();
        getAllCompetitor();

        render(<DetailCompetitor user={userWithWitel} access={"allowed"} />);
        await waitFor(() => null);
    });

    test("Detail competitor mock getStatusOcc", async () => {
        const status = ["RED", "ORANGE", "YELLOW", "BLACK_SYSTEM", "OTHER"];

        status.map((item) => getStatusOcc(item));
    });

    test("Detail competitor mock getOverallMatch", async () => {
        const match = ["L", "W"];

        match.map((item) => getOverallMatch(item));
    });

    test("Detail competitor mock exportCsv", async () => {
        exportCsv(listAllCompetitor);
    });
});
