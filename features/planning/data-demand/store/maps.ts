import { create } from "zustand";
import dayjs from "dayjs";

import { Kelurahan as Kelurahan_ } from "@api/district/metadata";
import { Respondent as Respondent_ } from "@api/survey-demand/respondent";

interface FilterStore {
    period: string;
    scales: string[];
    set: (data: object) => void;
    reset: () => void;
}

const period = dayjs().format("YYYY-MM-DD");
const scales = ["10", "11", "12"];
export const useFilterStore = create<FilterStore>((set) => ({
    period,
    scales,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set((state) => ({ ...state, period, scales })),
}));

export const kelurahanDefaultValue: Kelurahan = {
    st_name: "",
    kode_desa_dagri: "",
    kelurahan: "",
    kecamatan: "",
    kota: "",
    provinsi: "",
    regional: "",
    witel: "",
    geom: "",
    formattedAddress: "",
    lat: 0,
    long: 0,
};

export interface Kelurahan extends Kelurahan_ {
    formattedAddress?: string;
}

export const useKelurahanStore = create<Store<Kelurahan>>((set) => ({
    data: kelurahanDefaultValue,
    status: "idle",
    error: null,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set((state) => ({ ...state, data: kelurahanDefaultValue, status: "idle", error: null })),
}));

export const useOdpStore = create<Store<number>>((set) => ({
    data: 0,
    status: "idle",
    error: null,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set((state) => ({ ...state, data: 0, status: "idle", error: null })),
}));

export const respondentDefaultValue = { 10: 0, 11: 0, 12: 0 };
export interface Respondent {
    10: number;
    11: number;
    12: number;
}

export const useRespondentStore = create<Store<Respondent>>((set) => ({
    data: respondentDefaultValue,
    status: "idle",
    error: null,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set((state) => ({ ...state, data: respondentDefaultValue, status: "idle", error: null })),
}));

export const dataRespondentDefaultValue = { 10: [], 11: [], 12: [] };
export interface DataRespondent {
    10: Respondent_[];
    11: Respondent_[];
    12: Respondent_[];

    [key: number]: Respondent_[];
}

export const useDataRespondentStore = create<Store<DataRespondent>>((set) => ({
    data: dataRespondentDefaultValue,
    status: "idle",
    error: null,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set((state) => ({ ...state, data: dataRespondentDefaultValue, status: "idle", error: null })),
}));

interface BoundsRespondentStore {
    bounds: LatLngBounds | null;
    set: (data: object) => void;
    reset: () => void;
}

export const useBoundsRespondentStore = create<BoundsRespondentStore>((set) => ({
    bounds: null,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set((state) => ({ ...state, bounds: null })),
}));

import { Odp as OdpView, odpDefaultValue as odpViewDefaultValue, FilterStore as FilterOdpViewStore } from "@features/fulfillment/odp-view/store";

export const useOdpViewStore = create<Store<OdpView>>((set) => ({
    data: odpViewDefaultValue,
    status: "idle",
    error: null,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set((state) => ({ ...state, data: odpViewDefaultValue, status: "idle", error: null })),
}));

export const useSecondOdpViewStore = create<Store<OdpView>>((set) => ({
    data: odpViewDefaultValue,
    status: "idle",
    error: null,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set((state) => ({ ...state, data: odpViewDefaultValue, status: "idle", error: null })),
}));

export const useFilterOdpViewStore = create<FilterOdpViewStore>((set) => ({
    source: "uim",
    filters: [],
    radius: 200,
    smartsales: false,
    ipca_cluster: false,
    speedtest: false,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set((state) => ({ ...state, source: "uim", filters: [], radius: 200, smartsales: false, ipca_cluster: false, speedtest: false })),
}));
