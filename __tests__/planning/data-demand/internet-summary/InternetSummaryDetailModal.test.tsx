import React from "react";
import { describe, vi } from "vitest";

import { fireEvent, render, screen } from "@functions/test";

import DetailMapsInternetModal from "@features/planning/data-demand/components/modal/DetailMapsInternetModal";

const renderPage = () => {
    const view = render(<DetailMapsInternetModal />);

    return view;
};

vi.mock("@hooks/useModal", () => ({
    default: () => ({
        data: {
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
        modal: true,
        setModal: () => null,
    }),
}));

describe("Data demand internet summary page detail modal", () => {
    test("Test", async () => {
        renderPage();

        const closeIcon = await screen.findByTitle("modal-close");
        fireEvent.click(closeIcon);
    });
});
