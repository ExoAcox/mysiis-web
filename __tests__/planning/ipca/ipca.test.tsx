import { googleMaps } from "@exoacox/google-maps-vitest-mocks";
import { expect, vi } from "vitest";

import { axios, fireEvent, render, screen, user } from "@functions/test";

import Ipca from "@pages/planning/ipca";

import { useIpcaStore } from "@features/planning/ipca/store/cummon";

googleMaps();

const dataKelurahan = {
    st_name: "string",
    kode_desa_dagri: "string",
    kelurahan: "string",
    kecamatan: "string",
    kota: "string",
    provinsi: "string",
    regional: "string",
    witel: "string",
    geom: "POLYGON ((-3.706512451171875 40.420074462890625, -3.70513916015625 40.420074462890625, -3.70513916015625 40.42144775390625, -3.706512451171875 40.42144775390625, -3.706512451171875 40.420074462890625))",
};
const dataIpca = [
    {
        cluster_id: 3,
        id_project: 3,
        jumlah_huni: 3,
        potensi_hh: 3,
        nama_lop: "string",
        nama_segment: "string",
        kode_desa: "string",
        kelurahan: "string",
        kecamatan: "string",
        kabupaten: "string",
        provinsi: "string",
        regional: "string",
        witel: "string",
        status_priority: "PRIORITY",
        geom: "POLYGON ((-3.706512451171875 40.420074462890625, -3.70513916015625 40.420074462890625, -3.70513916015625 40.42144775390625, -3.706512451171875 40.42144775390625, -3.706512451171875 40.420074462890625))",
    },
];
const dataIpcaById = [
    {
        cluster_id: "string",
        code_sto: "string",
        device_id: 3,
        devicename: "string",
        deviceportnumber: 3,
        f_olt: "string",
        geom_point: "string",
        kandatel: "string",
        lat: 3,
        long: 3,
        networklocationcode: "string",
        odc_name: "string",
        odp_install: "string",
        portblockednumber: 3,
        portidlenumber: 3,
        portinservicenumber: 3,
        portreservednumber: 3,
        regional: "string",
        status_occ: "string",
        stoname: "string",
        tgl_proses: "string",
        updated_date: "string",
        updated_mysiis: "string",
        valins_id: "string",
        witel: "string",
    },
];

describe("Ipca Page", () => {
    test("test snapshoot ipca", () => {
        vi.useFakeTimers();
        render(<Ipca user={user} access={"allowed"} device={"desktop"} />).asFragment();
        vi.advanceTimersByTime(1000);
    });

    test("test desktop version ipca", async () => {
        vi.useFakeTimers();
        render(<Ipca user={user} access={"allowed"} device={"desktop"} />).asFragment();
        axios.get.mockResolvedValueOnce({ data: { data: dataKelurahan } });
        axios.get.mockResolvedValueOnce({ data: { data: dataIpca } });
        axios.get.mockResolvedValueOnce({ data: { data: dataIpcaById } });
        axios.get.mockResolvedValueOnce({ data: { data: ["ACEH"] } });
        vi.advanceTimersByTime(1000);
        await vi.dynamicImportSettled();

        const selectRegional = await screen.findByText("Pilih Regional");
        fireEvent.click(selectRegional);
        const regional = screen.getByText("Regional 1");
        fireEvent.click(regional);
        await vi.dynamicImportSettled();

        const selectWitel = await screen.findByText("Pilih Witel");
        fireEvent.click(selectWitel);
        const witel = screen.getByText("ACEH");
        fireEvent.click(witel);
        const btnExport = screen.getByText("Dapatkan Laporan");
        fireEvent.click(btnExport);

        const btnListSegment = screen.getByText("List Segment");
        fireEvent.click(btnListSegment);
        const btnListOdp = screen.getByText("Lihat ODP");
        fireEvent.click(btnListOdp);
        const btnTerapkan = screen.getByText("Terapkan");
        fireEvent.click(btnTerapkan);

        // modal list component
        const btnShowMap = screen.getAllByText("Lihat di Maps")[0];
        fireEvent.click(btnShowMap);
    });

    test("test mobile version ipca", async () => {
        vi.useFakeTimers();
        render(<Ipca user={user} access={"allowed"} device={"mobile"} />).asFragment();
        axios.get.mockResolvedValueOnce({ data: { data: dataKelurahan } });
        axios.get.mockResolvedValueOnce({ data: { data: dataIpca } });
        axios.get.mockResolvedValueOnce({ data: { data: dataIpcaById } });
        vi.advanceTimersByTime(1000);
        await vi.dynamicImportSettled();

        const btnLaporan = await screen.findByText("Dapatkan Laporan");
        fireEvent.click(btnLaporan);
        const checkBox = await screen.findByText("Lihat ODP");
        fireEvent.click(checkBox);
    });
});
