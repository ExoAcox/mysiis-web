import { create } from "zustand";

import { User } from "@api/account/user";
import { SurveyorAssignment } from "@api/survey-demand/mysiista";

interface SurveyorStore extends Store<SurveyorAssignment[]> {
    totalData: number;
}

export const useSurveyorStore = create<SurveyorStore>((set) => ({
    data: [],
    totalData: 0,
    status: "pending",
    error: null,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set({ data: [], totalData: 0, status: "pending", error: null }),
}));

interface SupervisorStore extends Store<User[]> {
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
    regional: string;
    witel: string;
    vendor: string;
    role: string;
    userid: string;
    mysistaid: string;
    set: (data: object) => void;
    reset: () => void;
}

const filterDefaultValue = {
    page: 1,
    row: 10,
    search: "",
    regional: "",
    witel: "",
    vendor: "",
    role: "",
    userid: "",
    mysistaid: "",
};

export const useFilterStore = create<FilterStore>((set) => ({
    ...filterDefaultValue,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set(filterDefaultValue),
}));
