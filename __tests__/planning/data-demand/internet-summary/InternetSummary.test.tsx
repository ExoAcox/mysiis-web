import { googleMaps } from "@exoacox/google-maps-vitest-mocks";
import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen, user } from "@functions/test";

import InternetSummary from "@pages/planning/data-demand/internet-summary";

const renderPage = (args?: { access?: Access; device?: Device }) => {
    const { access = "allowed", device = "desktop" } = args || {};

    vi.useFakeTimers();
    const view = render(<InternetSummary user={user} access={access} device={device} />);
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
                regional: "regional",
                witel: "witel",
                geom: "geom",
            },
        },
    });
};

const getAllMultilayerValues = {
    _id: "string",
    lat: 1,
    long: 1,
    provinsi: "string",
    occ_rate: "string",
    grid_id: "string",
    kabupaten_kota: "string",
    kecamatan: "string",
    desa_kelurahan: "string",
    zona_nilai_tanah: 1,
    jml_bangunan: 1,
    jml_testing_ookla: 1,
    jml_pelanggan_indihome: 1,
    jml_port_odp: 1,
    cluster_geo: "string",
    warning: "string",
    kode_desa_dagri: 1,
    sum_download_kbps: 1,
    sum_upload_kbps: 1,
    jumlah_speed_test_pada_kelurahan: 1,
    slope: 1,
    avg_download_kbps: 1,
    avg_upload_kbps: 1,
    recommended_estimated_downspeed_kbps: 1,
    recommended_estimated_upspeed_kbps: 1,
};

const getAllMultilayer = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: [
                {
                    ...getAllMultilayerValues,
                    prediksi: 1,
                    cluster: "Rendah",
                },
                {
                    ...getAllMultilayerValues,
                    prediksi: 4,
                    cluster: "Tinggi",
                },
                {
                    ...getAllMultilayerValues,
                    prediksi: 6,
                    cluster: "Tinggi",
                },
                {
                    ...getAllMultilayerValues,
                    prediksi: 8,
                    cluster: "Tinggi",
                },
                {
                    ...getAllMultilayerValues,
                    prediksi: 0,
                    cluster: "Tinggi",
                },
            ],
            meta: { all_data: 5 },
        },
    });
};

const getAllMultilayerEmptyData = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: [
                {
                    ...getAllMultilayerValues,
                    prediksi: 0,
                    cluster: "Cluster",
                },
            ],
            meta: { all_data: 1 },
        },
    });
};

// const getDirection = () => {
//     return axios.get.mockResolvedValueOnce({
//         data: {
//             data: {
//                 features: [
//                     {
//                         geometry: {
//                             coordinates: [[1, 1]],
//                         },
//                         properties: {
//                             summary: {
//                                 distance: 1,
//                                 duration: 1,
//                             },
//                         },
//                     },
//                 ],
//             },
//         },
//     });
// };

googleMaps();

describe("Data demand internet summary page", () => {
    test("Test snapshot", async () => {
        axios.get.mockResolvedValueOnce({});
        axios.get.mockResolvedValueOnce({});
        getKelurahanByLocation();
        getAllMultilayer();

        const view = renderPage();
        view.asFragment();
    });

    test("Internet summary error get data", async () => {
        axios.get.mockRejectedValueOnce({});
        axios.get.mockRejectedValueOnce({});

        renderPage();
    });

    // test("Internet summary test error", async () => {
    //     axios.get.mockResolvedValueOnce({});
    //     getKelurahanByLocation();
    //     getAllMultilayerEmptyData();

    //     renderPage();

    //     const tabButtonDetailSummary = screen.getByText("Detail Summary");
    //     fireEvent.click(tabButtonDetailSummary);

    //     const tabButtonInternetDemand = screen.getByText("Internet Demand");
    //     fireEvent.click(tabButtonInternetDemand);

    //     const setFilterActive = await screen.findByText("Atur Filter");
    //     fireEvent.click(setFilterActive);
    //     fireEvent.click(setFilterActive);

    //     getKelurahanByLocation();
    //     axios.get.mockRejectedValueOnce({ response: { data: { code: 404 } } });
    //     const setFilterPrediction = await screen.findByText("1-3 : Very High Demand Internet");
    //     fireEvent.click(setFilterPrediction);

    //     getKelurahanByLocation();
    //     axios.get.mockRejectedValueOnce({ response: { data: { code: 471 } } });
    //     fireEvent.click(setFilterPrediction);

    //     const setFilterCluster = await screen.findByText("Rendah");
    //     fireEvent.click(setFilterCluster);
    // });

    // test("Internet summary test success", async () => {
    //     axios.get.mockResolvedValueOnce({});
    //     getKelurahanByLocation();
    //     getAllMultilayer();

    //     renderPage();

    //     const tabButtonDetailSummary = screen.getByText("Detail Summary");
    //     fireEvent.click(tabButtonDetailSummary);

    //     const tabButtonInternetDemand = screen.getByText("Internet Demand");
    //     fireEvent.click(tabButtonInternetDemand);

    //     const setFilterActive = await screen.findByText("Atur Filter");
    //     fireEvent.click(setFilterActive);
    //     fireEvent.click(setFilterActive);

    //     getKelurahanByLocation();
    //     getAllMultilayer();
    //     const setFilterPrediction = await screen.findByText("1-3 : Very High Demand Internet");
    //     fireEvent.click(setFilterPrediction);

    //     const setFilterCluster = await screen.findByText("Rendah");
    //     fireEvent.click(setFilterCluster);
    // });

    test("Internet summary test access unauthorized", () => {
        renderPage({ access: "unauthorized" });
    });
});
