import { InfoWindow, googleMaps } from "@exoacox/google-maps-vitest-mocks";
import React from "react";
import { test, vi } from "vitest";

import { axios, fireEvent, render, screen, user } from "@functions/test";

import DistrictSummaryPage, { districtSummaryInfoWindows } from "@pages/planning/odp-area/district-summary";

import InfoDistrictSummaryMobile from "@features/planning/odp-area/components/Mobile/DistrictSummary/InfoDistrictSummary";
import TableDistrictSummary from "@features/planning/odp-area/components/TableDistrictSummary";
import { useSummaryTable } from "@features/planning/odp-area/store";

googleMaps();

const dataSummaryPenetration = [
    {
        _id: "string",
        st_name: "string",
        kode_desa_dagri: "string",
        kelurahan: "string",
        kecamatan: "string",
        kota: "string",
        provinsi: "string",
        long: 3,
        lat: 3,
        odp_portidlenumber: 3,
        odp_deviceportnumber: 3,
        odp_count: 3,
        building_count: 3,
        penetrasi_percent: 3,
        last_updated_at: "string",
    },
];

const dataKabupatenDagri = [
    {
        geom: "POLYGON ((-3.706512451171875 40.420074462890625, -3.70513916015625 40.420074462890625, -3.70513916015625 40.42144775390625, -3.706512451171875 40.42144775390625, -3.706512451171875 40.420074462890625))",
        kota: "jakarta",
        objectid: 1,
    },
];

const dataKabupatenDetail = [
    {
        id_kab: 1,
        kode_desa_dagri: "string",
        provinsi: "string",
        kota: "string",
        kecamatan: "string",
        kelurahan: "string",
        polygon_kel:
            "POLYGON ((-3.706512451171875 40.420074462890625, -3.70513916015625 40.420074462890625, -3.70513916015625 40.42144775390625, -3.706512451171875 40.42144775390625, -3.706512451171875 40.420074462890625))",
    },
];

const dataKota = [
    {
        st_name: "string",
        kode_desa_dagri: "string",
        kelurahan: "string",
        kecamatan: "string",
        kota: "Jakarta",
        provinsi: "DKI Jakarta",
        long: 3,
        lat: 3,
    },
];

describe("district-summary", () => {
    test("Snapshoot district-summary", () => {
        vi.useFakeTimers();
        const view = render(<DistrictSummaryPage user={user} device={"desktop"} />);
        vi.advanceTimersByTime(1000);

        view.asFragment();
    });

    test("should click maps district-summary", async () => {
        vi.useFakeTimers();
        axios.get.mockResolvedValueOnce({ data: { data: [{ provinsi: "DKI Jakarta" }] } });
        render(<DistrictSummaryPage user={user} device={"desktop"} />);
        axios.get.mockResolvedValueOnce({ data: { data: dataKabupatenDagri } });
        axios.get.mockResolvedValueOnce({ data: { data: dataKabupatenDetail } });
        axios.get.mockResolvedValueOnce({ data: { data: dataKota } });
        districtSummaryInfoWindows.push({
            ...InfoWindow(),
            setMap: vi.fn(),
            setOptions: vi.fn(),
            data: {
                kecamatan: "string",
                kelurahan: "string",
                building_count: 3,
            },
        });
        vi.advanceTimersByTime(1000);
    });

    // test("testing filter tabel", async () => {
    //     vi.useFakeTimers();
    //     axios.get.mockResolvedValueOnce({ data: { data: [{ provinsi: "DKI Jakarta" }] } });
    //     render(<DistrictSummaryPage user={user} device={"desktop"} />);
    //     // fetch kabupaten dagri
    //     axios.get.mockResolvedValueOnce({ data: { data: dataKabupatenDagri } });

    //     // fetch data kota dropdown
    //     axios.get.mockResolvedValueOnce({ data: { data: dataKota } });

    //     //fetch data kabupaten detail
    //     axios.get.mockResolvedValueOnce({ data: { data: dataKabupatenDetail } });
    //     districtSummaryInfoWindows.push({
    //         ...InfoWindow(),
    //         setMap: vi.fn(),
    //         setOptions: vi.fn(),
    //         data: {
    //             kecamatan: "string",
    //             kelurahan: "string",
    //             building_count: 3,
    //         },
    //     });
    //     const element = document.createElement("div");
    //     element.id = "mode-district-summary";
    //     element.dataset.mode = "penetration";
    //     vi.spyOn(document, "getElementById").mockReturnValue(element);
    //     vi.advanceTimersByTime(1000);

    //     const selectProvinsi = screen.getByText("Pilih Provinsi");
    //     fireEvent.click(selectProvinsi);
    //     const provinsi = await screen.findByText("DKI Jakarta");
    //     fireEvent.click(provinsi);

    //     const selectKota = screen.getByText("Pilih Kabupaten");
    //     fireEvent.click(selectKota);
    //     const kota = await screen.findByText("Jakarta");
    //     fireEvent.click(kota);
    //     const button = screen.getByText("Kirim");
    //     fireEvent.click(button);
    // });

    test("should InfoDistrictSummaryMobile", () => {
        render(<InfoDistrictSummaryMobile />);

        const info = screen.getByTestId("info-port");
        fireEvent.click(info);
    });

    test("should TableDistrictSummary", async () => {
        render(<TableDistrictSummary device="mobile" />);
        useSummaryTable.setState({
            data: dataSummaryPenetration,
            status: "resolve",
        });

        const kelurahan = await screen.findByText("Berdasarkan Kelurahan");
        fireEvent.click(kelurahan);
        const building = await screen.findByText("Berdasarkan Building");
        fireEvent.click(building);

        const kecamatan = await screen.findByText("Export CSV");
        fireEvent.click(kecamatan);
    });
});
