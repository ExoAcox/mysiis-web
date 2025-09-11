import { googleMaps } from "@exoacox/google-maps-vitest-mocks";
import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen, user } from "@functions/test";

import InternetSummary from "@pages/planning/data-demand/internet-summary";

const renderPage = (args?: { access?: Access; device?: Device }) => {
    const { access = "allowed", device = "mobile" } = args || {};

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

const getAllMultilayer = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: [
                {
                    _id: "String 1",
                    lat: 1,
                    long: 1,
                    prediksi: 1,
                    cluster: "Rendah",
                    provinsi: "String 1",
                    occ_rate: "String 1",
                    grid_id: "String 1",
                    kabupaten_kota: "String 1",
                    kecamatan: "String 1",
                    desa_kelurahan: "String 1",
                    zona_nilai_tanah: 1,
                    jml_bangunan: 1,
                    jml_testing_ookla: 1,
                    jml_pelanggan_indihome: 1,
                    jml_port_odp: 1,
                    cluster_geo: "String 1",
                    warning: "String 1",
                    kode_desa_dagri: 1,
                    sum_download_kbps: 1,
                    sum_upload_kbps: 1,
                    jumlah_speed_test_pada_kelurahan: 1,
                    slope: 1,
                    avg_download_kbps: 1,
                    avg_upload_kbps: 1,
                    recommended_estimated_downspeed_kbps: 1,
                    recommended_estimated_upspeed_kbps: 1,
                },
                {
                    _id: "String 2",
                    lat: 2,
                    long: 2,
                    prediksi: 4,
                    cluster: "Tinggi",
                    provinsi: "String 2",
                    occ_rate: "String 2",
                    grid_id: "String 2",
                    kabupaten_kota: "String 2",
                    kecamatan: "String 2",
                    desa_kelurahan: "String 2",
                    zona_nilai_tanah: 2,
                    jml_bangunan: 2,
                    jml_testing_ookla: 2,
                    jml_pelanggan_indihome: 2,
                    jml_port_odp: 2,
                    cluster_geo: "String 2",
                    warning: "String 2",
                    kode_desa_dagri: 2,
                    sum_download_kbps: 2,
                    sum_upload_kbps: 2,
                    jumlah_speed_test_pada_kelurahan: 2,
                    slope: 2,
                    avg_download_kbps: 2,
                    avg_upload_kbps: 2,
                    recommended_estimated_downspeed_kbps: 2,
                    recommended_estimated_upspeed_kbps: 2,
                },
                {
                    _id: "String 3",
                    lat: 3,
                    long: 3,
                    prediksi: 6,
                    cluster: "Tinggi",
                    provinsi: "String 3",
                    occ_rate: "String 3",
                    grid_id: "String 3",
                    kabupaten_kota: "String 3",
                    kecamatan: "String 3",
                    desa_kelurahan: "String 3",
                    zona_nilai_tanah: 3,
                    jml_bangunan: 3,
                    jml_testing_ookla: 3,
                    jml_pelanggan_indihome: 3,
                    jml_port_odp: 3,
                    cluster_geo: "String 3",
                    warning: "String 3",
                    kode_desa_dagri: 3,
                    sum_download_kbps: 3,
                    sum_upload_kbps: 3,
                    jumlah_speed_test_pada_kelurahan: 3,
                    slope: 3,
                    avg_download_kbps: 3,
                    avg_upload_kbps: 3,
                    recommended_estimated_downspeed_kbps: 3,
                    recommended_estimated_upspeed_kbps: 3,
                },
                {
                    _id: "String 4",
                    lat: 4,
                    long: 4,
                    prediksi: 8,
                    cluster: "Tinggi",
                    provinsi: "String 4",
                    occ_rate: "String 4",
                    grid_id: "String 4",
                    kabupaten_kota: "String 4",
                    kecamatan: "String 4",
                    desa_kelurahan: "String 4",
                    zona_nilai_tanah: 4,
                    jml_bangunan: 4,
                    jml_testing_ookla: 4,
                    jml_pelanggan_indihome: 4,
                    jml_port_odp: 4,
                    cluster_geo: "String 4",
                    warning: "String 4",
                    kode_desa_dagri: 4,
                    sum_download_kbps: 4,
                    sum_upload_kbps: 4,
                    jumlah_speed_test_pada_kelurahan: 4,
                    slope: 4,
                    avg_download_kbps: 4,
                    avg_upload_kbps: 4,
                    recommended_estimated_downspeed_kbps: 4,
                    recommended_estimated_upspeed_kbps: 4,
                },
            ],
            meta: { all_data: 4 },
        },
    });
};

vi.mock("@hooks/useMediaQuery", () => ({
    default: () => ({ width: 567, isMobile: true }),
}));

googleMaps();

describe("Data demand internet summary page mobile responsive", () => {
    test("Test snapshot", async () => {
        axios.get.mockResolvedValueOnce({});
        axios.get.mockResolvedValueOnce({});
        getKelurahanByLocation();
        getAllMultilayer();

        const view = renderPage();
        view.asFragment();
    });

    test("Internet summary test success", async () => {
        axios.get.mockResolvedValueOnce({});
        getKelurahanByLocation();
        getAllMultilayer();

        renderPage();

        const tabMapType = await screen.findByTitle("map-type-icon");
        fireEvent.click(tabMapType);

        const filterButton = await screen.findByText("Filter");
        fireEvent.click(filterButton);

        const closeIcon = screen.getByTitle("modal-close");
        fireEvent.click(closeIcon);

        fireEvent.click(filterButton);

        const applyButton = screen.getByText("Terapkan");
        fireEvent.click(applyButton);
    });
});
