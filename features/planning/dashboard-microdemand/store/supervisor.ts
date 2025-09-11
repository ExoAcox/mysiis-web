import { create } from "zustand";

import { GetSupervisor } from "@api/survey-demand/supervisor";

interface SupervisorStore extends Store<GetSupervisor[]> {
    totalData: number;
}

export const useSupervisorStore = create<SupervisorStore>((set) => ({
    data: [],
    totalData: 0,
    status: "pending",
    error: null,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set({ data: [], totalData: 0, status: "pending", error: null }),
}));

export interface FilterStore {
    page: number;
    row: number;
    search: string;
    set: (data: object) => void;
    reset: () => void;
}

const filterDefaultValue = {
    page: 1,
    row: 10,
    search: "",
};

export const useFilterStore = create<FilterStore>((set) => ({
    ...filterDefaultValue,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set(filterDefaultValue),
}));
