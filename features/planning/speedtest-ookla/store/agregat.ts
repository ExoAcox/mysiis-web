import { create } from "zustand";

import { Kelurahan } from "@api/district/metadata";
import { Agregat } from "@api/speedtest/ookla";

export const locationData: Kelurahan = {
    kode_desa_dagri: "",
    kelurahan: "",
    kecamatan: "",
    kota: "",
    provinsi: "",
    regional: "",
    witel: "",
    lat: 0,
    long: 0,
};

export const useLocationStore = create<Store<Kelurahan>>((set) => ({
    data: locationData,
    status: "idle",
    error: null,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set((state) => ({ ...state, data: locationData, status: "idle", error: null })),
}));

export const dataSelectedKelurahan = {
    avg_dl: 0,
    avg_ul: 0,
    max_dl: 0,
    max_ul: 0,
    min_dl: 0,
    min_ul: 0,
    top_isp: "",
    top_network_operator: "",
    total: 0,
};

export const useSelectedKelurahanStore = create<Store<Agregat>>((set) => ({
    data: dataSelectedKelurahan,
    status: "idle",
    error: null,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set((state) => ({ ...state, data: dataSelectedKelurahan, status: "idle", error: null })),
}));
