import { create } from "zustand";
import { CountPolygonStatus, Polygon } from "@api/survey-demand/mysiista";

interface PolygonTselStore extends Store<Polygon[]> {
    totalData: number;
    filteredCount: number;
}

export const usePolygonTselStore = create<PolygonTselStore>((set) => ({
    data: [],
    totalData: 0,
    filteredCount: 0,
    status: "pending",
    error: null,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set({ data: [], totalData: 0, filteredCount: 0, status: "pending", error: null }),
}));

interface PolygonCountStore extends Store<CountPolygonStatus> {
    totalData: number;
}

export const defaultCountPolygon = {
    draft: 0,
    cpp_approved: 0,
    cpp_rejected: 0,
    approved: 0,
    rejected: 0,
    assigned: 0,
    permit_rejected: 0,
    permit_process: 0,
    permit_approved: 0,
    finished_survey: 0,
    done: 0,
    pending: 0,
}

export const usePolygonCountStore = create<PolygonCountStore>((set) => ({
    data: defaultCountPolygon,
    totalData: 0,
    status: "pending",
    error: null,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set({ data: defaultCountPolygon, totalData: 0, status: "pending", error: null }),
}));

export interface FilterPolygonTselStore {
    page: number;
    row: number;
    status: string;
    area: string;
    regional: string;
    witel: string;
    keyword: string;
    set: (data: object) => void;
    reset: () => void;
}

const filterDefaultValue = {
    page: 1,
    row: 10,
    status: "",
    area: "",
    regional: "",
    witel: "",
    keyword: "",
};

export const useFilterStore = create<FilterPolygonTselStore>((set) => ({
    ...filterDefaultValue,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set(filterDefaultValue),
}));
