import { googleMaps } from "@exoacox/google-maps-vitest-mocks";
import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen, user, waitFor } from "@functions/test";

import OdpView from "@pages/fulfillment/odp-view";

import { getColor } from "@features/fulfillment/odp-view/functions/speedtest";

const renderPage = async (args?: { device?: Device; access?: Access }) => {
    const { device = "desktop", access = "allowed" } = args || {};

    vi.useFakeTimers();
    const view = render(<OdpView user={user} device={device} access={access} />);
    vi.advanceTimersByTime(1000);

    await vi.dynamicImportSettled();

    return view;
};

googleMaps();
vi.mock("firebase/analytics");
vi.mock("wkt-parser-helper");

const getKelurahan = () => {
    axios.get.mockResolvedValueOnce({});
    axios.get.mockResolvedValueOnce({
        data: { data: { geom: "POLYGON", st_name: "", kelurahan: "", kecamatan: "", kota: "", provinsi: "" } },
    });
};

const getOdp = () => {
    axios.get.mockResolvedValueOnce({ data: { data: [{ name: "odp", lat: 3, long: 3, status: "RED" }] } });
};

const getOdpBoundary = () => {
    axios.get.mockResolvedValueOnce({ data: { data: { polygon: "POLYGON", odp: [{ name: "odp", lat: 3, long: 3, status: "RED" }] } } });
};

const getPackage = () => {
    axios.get.mockResolvedValueOnce({
        data: { data: [{ packageXml: [{ TIPE_PAKET: "type" }] }] },
    });
};

const getDistance = () => {
    axios.get.mockResolvedValueOnce({
        data: { data: { features: [{ properties: { summary: { distance: 100 } }, geometry: { coordinates: [3, 3] } }] } },
    });
};

describe("Odp View page", () => {
    test("Test snapshot", async () => {
        const view = await renderPage();
        view.asFragment();
    });

    test("Odp hit", async () => {
        getKelurahan();
        getOdp();
        getDistance();
        getOdp();
        await renderPage();

        // View odp modal
        const viewOdp = await screen.findByText("Lihat Daftar ODP");
        fireEvent.click(viewOdp);
        const closeModal = await screen.findByTitle("modal-close");
        fireEvent.click(closeModal);

        // Filter odp
        const ready = screen.getByText("Ready");
        fireEvent.click(ready);

        const nearby = screen.getByText("Nearby");
        fireEvent.click(nearby);

        getOdpBoundary();
        getDistance();
        getOdpBoundary();
        const boundary = screen.getByText("Boundary");
        fireEvent.click(boundary);

        // Show smartsales
        axios.get.mockResolvedValue({ data: { data: { totalCount: 1, lists: [{ geom_grid: "POLYGON ZM", segment_score_cap_ok: 5 }] } } });
        const smartSales = await screen.findByText("Tampilkan SmartSales Grid");
        fireEvent.click(smartSales);

        // Show cluster priority
        axios.get.mockResolvedValue({ data: { data: [{ geom: "POLYGON", status_prioriy: "PRIORITY" }] } });
        const cluster = screen.getByText("Tampilkan Cluster Priority");
        fireEvent.click(cluster);

        // Show speedtest ookla
        axios.get.mockResolvedValue({
            data: {
                data: {
                    totalCount: 1,
                    lists: [{ client_latitude: 3, client_longitude: 3, flagging_isp: "Telkom" }],
                },
            },
        });
        const speedtest = screen.getByText("Tampilkan Speedtest Ookla");
        fireEvent.click(speedtest);
    });

    test("Mobile device", async () => {
        getKelurahan();
        getOdp();
        getPackage();
        getDistance();
        getOdp();
        await renderPage({ device: "mobile" });

        await waitFor(() => screen.findByTestId("bottom-sheet"));

        // Change map type
        const mapType = screen.getByTitle("maps-type");
        fireEvent.click(mapType);

        // View odp modal
        const viewOdp = screen.getByText("Lihat Daftar ODP");
        fireEvent.click(viewOdp);

        // Show speedtest
        axios.get.mockResolvedValue({
            data: {
                data: {
                    totalCount: 1,
                    lists: [{ client_latitude: 3, client_longitude: 3, flagging_isp: "Telkom" }],
                },
            },
        });
        const speedtest = screen.getByText("Tampilkan Speedtest Ookla");
        fireEvent.click(speedtest);
    });

    test("Odp dummy hit", () => {
        renderPage({ access: "unauthorized" });
    });

    test("Mock getColor speedtest", () => {
        const isps = ["Telkom", "Biznet", "MNC Play", "FirstMedia", "CBN", "MyRepublic", "Balifiber", "Stroomnet", "Oxygen", "XL", "Other"];

        isps.forEach((isp) => getColor(isp));
    });
});
