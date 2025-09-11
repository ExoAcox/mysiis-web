import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen, user, waitFor } from "@functions/test";

import DetailCompetitor from "@pages/planning/data-competitor/detail-competitor";

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
            data: listAllCompetitor,
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

vi.mock("@hooks/useMediaQuery", () => ({
    default: () => ({ width: 567, isMobile: true }),
}));

describe("Data competitor detail competitor mobile page", () => {
    test("Test snapshot mobile", async () => {
        axios.get.mockResolvedValueOnce({});
        getRegionalCompetitor();
        axios.get.mockResolvedValueOnce({});
        getAllCompetitor();
        getAllCompetitor();

        const view = renderPage();
        view.asFragment();
    });

    test("Detail competitor error get data mobile", async () => {
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});

        renderPage();
    });

    test("Detail competitor filter get data mobile", async () => {
        getRegionalCompetitor();
        axios.get.mockResolvedValueOnce({});
        getAllCompetitor();
        getAllCompetitor();

        renderPage();

        const buttonFilter = await screen.findByText("Filter");
        fireEvent.click(buttonFilter);
        await waitFor(() => screen.findByTestId("filter-table-mobile-modal"));

        const dropdownRegional = await screen.findAllByText("Semua Regional");
        fireEvent.click(dropdownRegional[1]);
        getWitelCompetitor();
        getAllCompetitor();
        const chooseDropdownRegional = await screen.findAllByText("Regional 1");
        fireEvent.click(chooseDropdownRegional[1]);

        fireEvent.click(chooseDropdownRegional[1]);
        getAllCompetitor();
        fireEvent.click(dropdownRegional[3]);

        fireEvent.click(dropdownRegional[1]);
        getWitelCompetitor();
        getAllCompetitor();
        fireEvent.click(chooseDropdownRegional[1]);

        const dropdownWitel = await screen.findAllByText("Pilih Witel");
        fireEvent.click(dropdownWitel[1]);
        getAllCompetitor();
        const chooseDropdownWitel = await screen.findAllByText("Witel 1");
        fireEvent.click(chooseDropdownWitel[1]);

        fireEvent.click(chooseDropdownWitel[1]);
        getAllCompetitor();
        const dropdownWitelAll = await screen.findAllByText("Semua Witel");
        fireEvent.click(dropdownWitelAll[1]);

        fireEvent.click(dropdownWitel[1]);
        getAllCompetitor();
        fireEvent.click(chooseDropdownWitel[1]);

        const dropdownStatus = await screen.findAllByText("Semua Status");
        fireEvent.click(dropdownStatus[1]);
        getAllCompetitor();
        const chooseDropdownStatus = await screen.findAllByText("Rekomendasi");
        fireEvent.click(chooseDropdownStatus[1]);

        const buttonDetail = await screen.findAllByText("Lihat");
        fireEvent.click(buttonDetail[1]);
    });
});
