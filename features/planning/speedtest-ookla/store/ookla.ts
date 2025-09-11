import { create } from "zustand";
import dayjs from "dayjs";

import { Kelurahan } from "@api/district/metadata";
import { Ookla } from "@api/speedtest/ookla";

export const kelurahanSpeedtestData: Kelurahan = {
    geom: "",
    kecamatan: "",
    kelurahan: "",
    kode_desa_dagri: "",
    kota: "",
    provinsi: "",
    regional: "",
    witel: "",
    lat: 0,
    long: 0,
};

export const useKelurahanSpeedtestStore = create<Store<Kelurahan>>((set) => ({
    data: kelurahanSpeedtestData,
    status: "idle",
    error: null,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set((state) => ({ ...state, data: kelurahanSpeedtestData, status: "idle", error: null })),
}));

export type SpeedtestSource = "radius" | "kelurahan";
export type SpeedtestCardFilter = "isp" | "operator";
export interface FilterSpeedtestStore {
    date: string;
    nextDate: string;
    source: SpeedtestSource;
    filter: SpeedtestCardFilter;
    radius: number;
    set: (data: object) => void;
    reset: () => void;
}

const date = dayjs().subtract(3, "month").format("YYYY-MM-DD");
const nextDate = dayjs().format("YYYY-MM-DD");
export const useFilterSpeedtestStore = create<FilterSpeedtestStore>((set) => ({
    date,
    nextDate,
    source: "radius",
    filter: "isp",
    radius: 200,
    set: (data) => set(data),
    reset: () => set({ date, nextDate, source: "radius", radius: 200 }),
}));

export interface DataSpeedtest {
    lists: Ookla[];
    total_count: number;
}

export const useSpeedtestStore = create<Store<DataSpeedtest>>((set) => ({
    data: { lists: [], total_count: 0 },
    status: "idle",
    error: null,
    set: (data) => set(data),
    reset: () => set({ data: { lists: [], total_count: 0 }, status: "idle", error: null }),
}));

export interface DataLists {
    label: string;
    list: Ookla[];
}

export interface SpeedtestsLabel {
    [key: string]: Ookla[];
}

export interface DataCard {
    dataIsp: DataLists[];
    dataOperator: DataLists[];
    ispPolygonLabel: SpeedtestsLabel;
    operatorPolygonLabel: SpeedtestsLabel;
    set: (data: object) => void;
    reset: () => void;
}

export const useSpeedtestCardStore = create<DataCard>((set) => ({
    dataIsp: [],
    dataOperator: [],
    ispPolygonLabel: {},
    operatorPolygonLabel: {},
    set: (data) => set(data),
    reset: () => set({ dataIsp: [], dataOperator: [] }),
}));
