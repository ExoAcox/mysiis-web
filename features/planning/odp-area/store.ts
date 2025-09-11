import { SummaryPenetration } from "@api/district/summary";
import { OdpUim, OdpUimMiniByKabupaten } from "@api/odp";
import { create } from "zustand";

export const useSource = create<StoreSource>((set) => ({
    source: "odp-summary",
    setSource: (e) => set({ source: e }),
    resetStore: () => set({ source: "odp-summary" }),
}));

export const useSummaryTable = create<StoreSummaryTable>((set) => ({
    data: [],
    error: null,
    status: "idle",
    set: (e) => set({ data: e }),
    reset: () => set({ data: [] }),
}));

const valueDefault = { label: "", value: "" };

export const useListProvinsi = create<StoreDistrict>((set) => ({
    data: [valueDefault],
    error: null,
    status: "idle",
    set: () => set((state) => ({ ...state })),
    reset: () => set({ data: [valueDefault] }),
}));

export const useListKota = create<StoreDistrictKota>((set) => ({
    data: [{ ...valueDefault, latLng: { lat: 0, lng: 0 } }],
    error: null,
    status: "idle",
    set: () => set((state) => ({ ...state })),
    reset: () => set({ data: [{ ...valueDefault, latLng: { lat: 0, lng: 0 } }] }),
}));

// Odp Summary

const DataOdpSummary = {
    _id: "",
    id_kab: 0,
    kecamatan: "",
    kelurahan: "",
    kode_desa_dagri: "",
    kota: "",
    last_updated_at: "",
    lat: 0,
    long: 0,
    odp_uim_portinservicenumber: 0,
    odp_uim_portreservednumber: 0,
    odp_uim_unknownportnumber: 0,
    odp_uim_count: 0,
    odp_uim_deviceportnumber: 0,
    odp_uim_portidlenumber: 0,
    odp_valins_count: 0,
    odp_valins_deviceportnumber: 0,
    odp_valins_portidlenumber: 0,
    polygon_kel: "",
    provinsi: "",
};

export const useOdpSummaryStore = create<StoreOdpSummary>((set) => ({
    data: DataOdpSummary,
    status: "idle",
    set: () => set((state) => ({ ...state })),
    reset: () => set({ data: DataOdpSummary }),
}));

export const useOdpUimValinsStore = create<StoreOdpUimValins>((set) => ({
    data: [DataOdpSummary],
    set: () => set((state) => ({ ...state })),
    reset: () => set({ data: [DataOdpSummary] }),
}));

// District Odp

const kelurahan = {
    st_name: "",
    kode_desa_dagri: "",
    kelurahan: "",
    kecamatan: "",
    kota: "",
    provinsi: "",
    regional: "",
    witel: "",
    geom: "",
};

interface DistrictStore {
    data: {
        st_name?: string;
        kode_desa_dagri: string;
        kelurahan: string;
        kecamatan: string;
        kota: string;
        provinsi: string;
        regional: string;
        witel: string;
        geom?: string;
    };
    status: DataStatus;
    error: DataError;
    set: () => void;
    reset: () => void;
}

export const useDistrictStore = create<DistrictStore>((set) => ({
    data: kelurahan,
    status: "idle",
    error: null,
    set: () => set((state) => ({ ...state })),
    reset: () => set({ data: kelurahan, status: "idle" }),
}));

export interface Summary {
    portidlenumber: number;
    deviceportnumber: number;
    total_odp: number;
    kode_desa_dagri?: string;
    status_occ_add: {
        red: number;
        orange: number;
        yellow: number;
        green: number;
        black_system: number;
        black: number;
    };
    lists: OdpUim[];
}

const summary = {
    portidlenumber: 0,
    deviceportnumber: 0,
    total_odp: 0,
    kode_desa_dagri: "",
    status_occ_add: {
        red: 0,
        orange: 0,
        yellow: 0,
        green: 0,
        black_system: 0,
        black: 0,
    },
    lists: [],
};

export const useDistrictOdpSummaryStore = create<Store<Summary>>((set) => ({
    data: summary,
    status: "idle",
    error: null,
    set: () => set((state) => ({ ...state })),
    reset: () => set({ data: summary, status: "idle" }),
}));

interface CountStore {
    countTotal: number;
    status: "idle" | "pending" | "resolve" | "reject";
    error?: DataError | null;
    reset: () => void;
}

export const useCountTotalBuidlingStore = create<CountStore>((set) => ({
    countTotal: 0,
    status: "idle",
    error: null,
    reset: () => set({ countTotal: 0, status: "idle" }),
}));

export const useDistrictOdpStore = create<Store<OdpUim[]>>((set) => ({
    data: [],
    status: "idle",
    error: null,
    set: () => set((state) => ({ ...state })),
    reset: () => set({ data: [], status: "idle" }),
}));

export interface DataPolygon {
    id: number;
    sumber: string;
    geom: string;
    kode_desa: string;
    provinsi: string;
    kota: string;
    kecamatan: string;
    kelurahan: string;
}

export const useDistrictBuildingStore = create<Store<DataPolygon[]>>((set) => ({
    data: [],
    status: "idle",
    error: null,
    set: () => set((state) => ({ ...state })),
    reset: () => set({ data: [], status: "idle" }),
}));

export const useDistrictHeatmapStore = create<Store<OdpUimMiniByKabupaten[]>>((set) => ({
    data: [],
    status: "idle",
    error: null,
    set: () => set((state) => ({ ...state })),
    reset: () => set({ data: [], status: "idle" }),
}));

export const useSummaryPenetrasiOdpBuildingStore = create<Store<SummaryPenetration[]>>((set) => ({
    data: [],
    status: "idle",
    error: null,
    set: () => set((state) => ({ ...state })),
    reset: () => set({ data: [], status: "idle" }),
}));

interface DistrictSummaryStore {
    data: SummaryPenetration;
    status: string;
    error: null;
    set: (e: SummaryPenetration) => void;
    reset: () => void;
}

const dataDefaultDistrictSummary = {
    _id: "",
    st_name: "",
    kode_desa_dagri: "",
    kelurahan: "",
    kecamatan: "",
    kota: "",
    provinsi: "",
    long: 0,
    lat: 0,
    odp_portidlenumber: 0,
    odp_deviceportnumber: 0,
    odp_count: 0,
    building_count: 0,
    penetrasi_percent: 0,
    last_updated_at: "",
};

export const useDistrictSummaryStore = create<DistrictSummaryStore>((set) => ({
    data: dataDefaultDistrictSummary,
    status: "idle",
    error: null,
    set: () => set((state) => ({ ...state })),
    reset: () => set({ data: dataDefaultDistrictSummary, status: "idle" }),
}));

interface KodeDesa {
    kode_desa_dagri: string;
    status: DataStatus;
    error: object | null;
    set: (e: string) => void;
    reset: () => void;
}

export const useKodeDesaDagri = create<KodeDesa>((set) => ({
    kode_desa_dagri: "",
    status: "idle",
    error: null,
    set: (kode) => set(() => ({ kode_desa_dagri: kode, status: "resolve" })),
    reset: () => set({ kode_desa_dagri: "", status: "idle" }),
}));

type report = { penetration: string; readiness: string };

interface Report {
    report: report;
    status: DataStatus;
    error: object | null;
    set: (e: report) => void;
    reset: () => void;
}

export const useReport = create<Report>((set) => ({
    report: { penetration: "0", readiness: "0" },
    status: "idle",
    error: null,
    set: (data) => set(() => ({ report: data, status: "resolve" })),
    reset: () => set({ report: { penetration: "0", readiness: "0" }, status: "idle" }),
}));
