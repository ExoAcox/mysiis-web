import { googleMaps } from "@exoacox/google-maps-vitest-mocks";
import React from "react";
import { test, vi } from "vitest";

import { fireEvent, render, screen, user } from "@functions/test";

import DistrictOdpPage from "@pages/planning/odp-area/district-odp";

import { useDistrictBuildingStore, useDistrictOdpSummaryStore } from "@features/planning/odp-area/store";

googleMaps();

vi.mock("wkt-parser-helper");

describe("odp-summary DistrictSummaryPage", () => {
    test("Snapshoot DistrictSummaryPage", () => {
        vi.useFakeTimers();
        render(<DistrictOdpPage user={user} device={"desktop"} />).asFragment();
        vi.advanceTimersByTime(1000);
    });

    test("test mobile version", async () => {
        useDistrictOdpSummaryStore.setState({ status: "resolve" });

        vi.useFakeTimers();
        render(<DistrictOdpPage user={user} device={"mobile"} />);
        vi.advanceTimersByTime(1000);
        const btnFilter = screen.getByText("Filter");
        fireEvent.click(btnFilter);

        const btn = screen.getByText("Terapkan");
        fireEvent.click(btn);
        await vi.dynamicImportSettled();

        useDistrictBuildingStore.setState({ status: "resolve" });
        useDistrictOdpSummaryStore.setState({
            status: "resolve",
            data: {
                portidlenumber: 2,
                deviceportnumber: 3,
                total_odp: 30,
                kode_desa_dagri: "213",
                status_occ_add: {
                    red: 2,
                    orange: 3,
                    yellow: 4,
                    green: 5,
                    black_system: 4,
                    black: 3,
                },
                lists: [
                    {
                        device_id: 2,
                        devicename: "string",
                        lat: 0,
                        long: 0,
                        status_occ_add: "RED",
                        portidlenumber: "string",
                        deviceportnumber: "string",
                        odp: "string",
                        updated_mysiis: "string",
                        networklocationcode: "string",
                        code_sto: "string",
                        portinservicenumber: 0,
                        odp_install: "string",
                    },
                ],
            },
        });

        const btnModalOdp = await screen.findByText("Lihat Daftar ODP");
        fireEvent.click(btnModalOdp);
    });

    test("test Desktop version DistrictSummaryPage", async () => {
        vi.useFakeTimers();
        render(<DistrictOdpPage user={user} device={"desktop"} />);
        vi.advanceTimersByTime(1000);
        await vi.dynamicImportSettled();

        useDistrictOdpSummaryStore.setState({ status: "resolve" });
        useDistrictBuildingStore.setState({ status: "resolve" });
    });
});
