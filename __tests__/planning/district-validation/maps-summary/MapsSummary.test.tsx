import { googleMaps } from "@exoacox/google-maps-vitest-mocks";
import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen, user, waitFor } from "@functions/test";

import MapsSummary from "@pages/planning/district-validation/maps-summary";

const renderPage = async (args?: { device?: Device; access?: Access }) => {
    const { access = "allowed" } = args || {};

    vi.useFakeTimers();
    const view = render(<MapsSummary user={user} access={access} />);
    vi.advanceTimersByTime(1000);

    await vi.dynamicImportSettled();

    return view;
};

const getKelurahanByLocation = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: {
                st_name: "name",
                kode_desa_dagri: "kode",
                kelurahan: "kelurahan",
                kecamatan: "kecamatan",
                kota: "kota",
                provinsi: "profinsi",
                regional: "regional",
                witel: "witel",
                geom: "POLYGON",
            },
        },
    });
};   

const getNcx = () => {
    return axios.get.mockResolvedValue({
        data: {
            data: {
                lat: 0,
                long: 0,
                google: {
                    address_components: [
                        {
                            long_name: "string",
                            short_name: "string",
                            types: ["string"],
                        },
                    ],
                    formatted_address: "string",
                },
                ncx: {
                    kelurahan: {
                        name: "string",
                        id: "string",
                        is_alternative: true,
                    },
                    kecamatan: {
                        name: "string",
                        id: "string",
                        is_alternative: true,
                    },
                    kabupaten: {
                        name: "string",
                        id: "string",
                        is_alternative: true,
                    },
                    provinsi: {
                        name: "string",
                        id: "string",
                        is_alternative: true,
                    },
                },
                googleAddress: {
                    kelurahan: "string",
                    kecamatan: "string",
                    kota: "string",
                    provinsi: "string",
                },
                addressNcx: {
                    kelurahan: "string",
                    kecamatan: "string",
                    kota: "string",
                    provinsi: "string",
                },
                ncx_pendekatan: {
                    kelurahan: "string",
                    kecamatan: "string",
                    kota: "string",
                    provinsi: "string",
                },
            },
        },
    });
};

const getStreet = () => {
    return axios.get.mockResolvedValue({
        data: {
            data: [
                {
                    lat: 0,
                    long: 0,
                    radius: 0,
                    geom: "MULTILINESTRING",
                    kecamatan: "string",
                    kelurahan: "string",
                    kode_desa_dagri: "string",
                    kota: "string",
                    provinsi: "string",
                    st_name: "string",
                    multiline: true,
                    name_street: "string",
                },
            ],
        },
    });
};

vi.mock("next/router", async () => {
    const actual = await (vi.importActual as any)("next/router");

    return {
        ...actual,
        useRouter: () => ({
            pathname: "",
            query: {
                lat: 3,
                lng: 3,
            },
        }),
    };
});

googleMaps();

describe("District Validation page", () => {
    test("Test snapshot", async () => {
        getKelurahanByLocation();
        getNcx();
        getStreet();

        const view = await renderPage();
        view.asFragment();
    });

    test("Street not include multiline", async () => {
        getKelurahanByLocation();
        
        axios.get.mockResolvedValue({
            data: {
                data: [
                    {
                        lat: 0,
                        long: 0,
                        radius: 0,
                        geom: "POLYGON",
                        kecamatan: "string",
                        kelurahan: "string",
                        kode_desa_dagri: "string",
                        kota: "string",
                        provinsi: "string",
                        st_name: "string",
                        multiline: true,
                        name_street: "string",
                    },
                ],
            },
        });

        renderPage();
    });

    test("Radius", () => {
        getKelurahanByLocation();
        getNcx();
        getStreet();
        getNcx();
        getNcx();

        renderPage();

        const inputRadius = screen.getByTestId("slider");
        fireEvent.change(inputRadius, { target: { value: "100" } });
    });

    test("Info card", async () => {
        getKelurahanByLocation();

        renderPage();

        await waitFor(() => screen.findByText("SIIS address data"));
    });

    test("NCX card reject", async () => {
        getKelurahanByLocation();

        axios.get.mockRejectedValueOnce({
            data: {
                data: {
                    lat: 0,
                    long: 0,
                    google: {
                        address_components: [
                            {
                                long_name: "string",
                                short_name: "string",
                                types: ["string"],
                            },
                        ],
                        formatted_address: "string",
                    },
                    ncx: {
                        kelurahan: {
                            name: "string",
                            id: "string",
                            is_alternative: true,
                        },
                        kecamatan: {
                            name: "string",
                            id: "string",
                            is_alternative: true,
                        },
                        kabupaten: {
                            name: "string",
                            id: "string",
                            is_alternative: true,
                        },
                        provinsi: {
                            name: "string",
                            id: "string",
                            is_alternative: true,
                        },
                    },
                    googleAddress: {
                        kelurahan: "string",
                        kecamatan: "string",
                        kota: "string",
                        provinsi: "string",
                    },
                    addressNcx: {
                        kelurahan: "string",
                        kecamatan: "string",
                        kota: "string",
                        provinsi: "string",
                    },
                    ncx_pendekatan: {
                        kelurahan: "string",
                        kecamatan: "string",
                        kota: "string",
                        provinsi: "string",
                    },
                },
            },
        });

        renderPage();

        await waitFor(() => screen.findByText("Terjadi kesalahan, hubungi customer service terkait masalah berikut atau coba lagi nanti."));
    });
});
