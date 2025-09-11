import { InfoWindow, googleMaps } from "@exoacox/google-maps-vitest-mocks";
import React from "react";
import { describe, test, vi } from "vitest";

import { axios, fireEvent, render, screen, user } from "@functions/test";

import OdpSummaryPage, { odpAreaInfoWindowsOdpSumaary } from "@pages/planning/odp-area/odp-summary";

googleMaps();

describe("odp-summary", () => {

    test("should click maps", async () => {
        vi.useFakeTimers();
        render(<OdpSummaryPage user={user} device={"desktop"} />);
        const dataKabupatenDagri = [
            {
                geom: "POLYGON ((-3.706512451171875 40.420074462890625, -3.70513916015625 40.420074462890625, -3.70513916015625 40.42144775390625, -3.706512451171875 40.42144775390625, -3.706512451171875 40.420074462890625))",
                kota: "jakarta",
                objectid: 1,
            },
        ];

        axios.get.mockResolvedValueOnce({ data: { data: dataKabupatenDagri } });

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

        axios.get.mockResolvedValueOnce({ data: { data: dataKabupatenDetail } });
        odpAreaInfoWindowsOdpSumaary.push({
            ...InfoWindow(),
            setMap: vi.fn(),
            setOptions: vi.fn(),
            data: {
                kecamatan: "string",
                kelurahan: "string",
                odp_valins_count: 3,
                odp_uim_count: 3,
            },
        });
        vi.advanceTimersByTime(1000);
    });

    test("should filter odp-summary", async () => {

        vi.useFakeTimers();
        render(<OdpSummaryPage user={user} device={"desktop"} />);
        axios.get.mockResolvedValueOnce({ data: { data: [{ provinsi: "DKI Jakarta" }] } });
        const dataKota = [
            {
                st_name: "string",
                kode_desa_dagri: "string",
                kelurahan: "string",
                kecamatan: "string",
                kota: "JAKARTA PUSAT",
                provinsi: "DKI Jakarta",
                long: 3,
                lat: 3,
            },
        ];
        axios.get.mockResolvedValueOnce({ data: { data: dataKota } });
        const selectProvinsi = await screen.findByText("Pilih Provinsi");
        fireEvent.click(selectProvinsi);
        const provinsi = await screen.findByText("DKI Jakarta");
        fireEvent.click(provinsi);
        const selectKota = screen.getByText("Pilih Kabupaten");
        fireEvent.click(selectKota);
        const kabupaten = await screen.findByText("JAKARTA PUSAT");
        fireEvent.click(kabupaten);
        const button = screen.getByText("Set Filter");
        fireEvent.click(button);
        const dataKabupatenDagri = [
            {
                geom: "POLYGON ((-3.706512451171875 40.420074462890625, -3.70513916015625 40.420074462890625, -3.70513916015625 40.42144775390625, -3.706512451171875 40.42144775390625, -3.706512451171875 40.420074462890625))",
                kota: "jakarta",
                objectid: 1,
            },
        ];

        axios.get.mockResolvedValueOnce({ data: { data: dataKabupatenDagri } });

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

        axios.get.mockResolvedValueOnce({ data: { data: dataKabupatenDetail } });
        odpAreaInfoWindowsOdpSumaary.push({
            ...InfoWindow(),
            setMap: vi.fn(),
            setOptions: vi.fn(),
            data: {
                kecamatan: "string",
                kelurahan: "string",
                odp_valins_count: 0,
                odp_uim_count: 0,
            },
        });
    });
});
