import { create } from "zustand";

interface FilterInternetStore {
    predict: string[];
    cluster: string[];
    set: (data: object) => void;
    reset: () => void;
}

const predict = ["1,2,3", "4,5", "6,7", "8,9,10"];
const cluster = ["Rendah", "Rerata Rendah", "Sedang", "Rerata Tinggi", "Tinggi"];

export const useFilterInternetStore = create<FilterInternetStore>((set) => ({
    predict,
    cluster,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set((state) => ({ ...state, predict, cluster })),
}));

import { AllMultilayer } from "@api/multilayer/feedback";

interface DataInternetStore extends AllMultilayer {
    status: string;
    error: DataError;
    set: (data: object) => void;
    reset: () => void;
}

export const useDataInternetStore = create<DataInternetStore>((set) => ({
    lists: [],
    totalData: 0,
    status: "idle",
    error: null,
    set: (data) => set(data),
    reset: () => set({ lists: [], totalData: 0, status: "idle", error: null }),
}));
