import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen, user, waitFor } from "@functions/test";

import SummaryMissingStreet from "@pages/planning/district-validation/summary-missing-street";

vi.mock("react-chartjs-2");

const renderPage = async (args?: { device?: Device; access?: Access }) => {
    const { access = "allowed" } = args || {};

    vi.useFakeTimers();
    const view = render(<SummaryMissingStreet user={user} access={access} />);
    vi.advanceTimersByTime(1000);

    await vi.dynamicImportSettled();

    return view;
};

const getSummaryNcxMiss = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: [{
                start_date: "string",
                end_date: "string",
                reason: "string",
                page: 0,
                count: 0,
                detail: [{ 
                    count: 0, 
                    tanggal: "string" 
                }],
                provinsi: "string",
                labels: ["string"],
                datasets: { 
                    data: [0], 
                    label: "string" 
                },
                row: 0,
                kota: "string",
                kecamatan: "string",
                kabupaten: "string",
                kelurahan: "string",
            }]
        }
    })
};

const getNcxMiss = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: {
                filteredCount: "string",
                lists: [{
                    created_at: "string",
                    geom: "string",
                    id: 0,
                    lat: 0,
                    long: 0,
                    mysiis_kecamatan: "string",
                    mysiis_kelurahan: "string",
                    mysiis_kode_desa_dagri: "string",
                    mysiis_kota: "string",
                    mysiis_lat: "string",
                    mysiis_long: "string",
                    mysiis_provinsi: "string",
                    mysiis_st_name: "string",
                }],
                totalCount: "string",
            }
        }
    })
};

const getProvinsi = () => {
    return axios.get.mockResolvedValueOnce({
        data: { data: [{ provinsi: "JAWA TENGAH" }, { provinsi: "JAWA BARAT" }] },
    });
};

const getKota = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: [{
                st_name: "string",
                kode_desa_dagri: "string",
                kelurahan: "string",
                kecamatan: "string",
                kota: "BOGOR",
                provinsi: "string",
                long: 0,
                lat: 0,
            }]
        }
    })
};

const getKecamatan = () => {
    return axios.get.mockResolvedValueOnce({
        data: { data: [{ kecamatan: "CIAWI" }, { kecamatan: "CIBINONG" }] },
    });
};

const getKelurahan = () => {
    return axios.get.mockResolvedValueOnce({
        data: { 
            data: [{
                kecamatan: "string",
                kelurahan: "PABUARAN",
                kode_desa_dagri: "string",
                kota: "string",
                lat: 0,
                long: 0,
                provinsi: "string",
                st_name: "string",
            }] 
        },
    });
};

describe("Summary Missing Street page ", () => {
    test("Test snapshot", async () => {
        axios.get.mockResolvedValueOnce({});
        getSummaryNcxMiss();
        getProvinsi();
        getNcxMiss();

        const view = await renderPage();
        view.asFragment();
    });

    test("Missing street table", async () => {
        getSummaryNcxMiss();
        getProvinsi();
        getNcxMiss();

        renderPage();

        const dropdownProvinsi = await screen.findAllByText("Semua Provinsi");
        fireEvent.click(dropdownProvinsi[1]);

        getKota();
        getNcxMiss();
        const chooseProvinsi = await screen.findByText("JAWA BARAT");
        fireEvent.click(chooseProvinsi);

        const dropdownKota = await screen.findAllByText("Semua Kota");
        fireEvent.click(dropdownKota[0]);

        getKecamatan();
        getNcxMiss();
        const chooseKota = await screen.findByText("BOGOR");
        fireEvent.click(chooseKota);

        const dropdownkecamatan = await screen.findAllByText("Semua Kecamatan");
        fireEvent.click(dropdownkecamatan[0]);

        getKelurahan();
        getNcxMiss();
        const chooseKecamatan = await screen.findByText("CIBINONG");
        fireEvent.click(chooseKecamatan);

        const dropdownkelurahan = await screen.findAllByText("Semua Kelurahan");
        fireEvent.click(dropdownkelurahan[0]);

        getNcxMiss();
        const choosekelurahan = await screen.findByText("PABUARAN");
        fireEvent.click(choosekelurahan);
    });
});