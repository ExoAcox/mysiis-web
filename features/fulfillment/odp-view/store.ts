import { create } from "zustand";

import { Kelurahan as Kelurahan_ } from "@api/district/metadata";
import { OdpSource } from "@api/odp";

export type OdpFilter = "ready" | "nearby" | "boundary";

export interface FilterStore {
    source: OdpSource;
    filters: OdpFilter[];
    radius: number;
    smartsales: boolean;
    ipca_cluster: boolean;
    speedtest: boolean;
    set: (data: object) => void;
    reset: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
    source: "uim",
    filters: [],
    radius: 200,
    smartsales: false,
    ipca_cluster: false,
    speedtest: false,
    set: (data) => set(data),
    reset: () => set({ source: "uim", filters: [], radius: 200, smartsales: false, ipca_cluster: false, speedtest: false }),
}));

export const kelurahanDefaultValue = {
    st_name: "",
    kode_desa_dagri: "",
    kelurahan: "",
    kecamatan: "",
    kota: "",
    provinsi: "",
    regional: "",
    witel: "",
    lat: 0,
    long: 0,
    geom: "",
    formattedAddress: "",
};

interface Kelurahan extends Kelurahan_ {
    formattedAddress?: string;
}

export const useKelurahanStore = create<Store<Kelurahan>>((set) => ({
    data: kelurahanDefaultValue,
    status: "idle",
    error: null,
    set: (data) => set(data),
    reset: () => set({ data: kelurahanDefaultValue, status: "idle", error: null }),
}));

export interface Odp {
    value: number;
    percent: number;
}

export const odpDefaultValue = { value: 0, percent: 0 };

export const useOdpStore = create<Store<Odp>>((set) => ({
    data: odpDefaultValue,
    status: "idle",
    error: null,
    set: (data) => set(data),
    reset: () => set({ data: odpDefaultValue, status: "idle", error: null }),
}));

export const useSecondOdpStore = create<Store<Odp>>((set) => ({
    data: odpDefaultValue,
    status: "idle",
    error: null,
    set: (data) => set(data),
    reset: () => set({ data: odpDefaultValue, status: "idle", error: null }),
}));

export const useSmartSalesStore = create<Store<number>>((set) => ({
    data: 0,
    status: "idle",
    error: null,
    set: (data) => set(data),
    reset: () => set({ data: 0, status: "idle", error: null }),
}));

export const useClusterStore = create<Store<number>>((set) => ({
    data: 0,
    status: "idle",
    error: null,
    set: (data) => set(data),
    reset: () => set({ data: 0, status: "idle", error: null }),
}));

export const useSpeedtestStore = create<Store<number>>((set) => ({
    data: 0,
    status: "idle",
    error: null,
    set: (data) => set(data),
    reset: () => set({ data: 0, status: "idle", error: null }),
}));
