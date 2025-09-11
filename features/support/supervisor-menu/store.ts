import { create } from "zustand";

import { User } from "@api/account/user";

interface MemberStore extends Store<User[]> {
    totalData: number;
}

export const useUserStore = create<MemberStore>((set) => ({
    data: [],
    totalData: 0,
    status: "pending",
    error: null,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set({ data: [], totalData: 0, status: "pending", error: null }),
}));

export type Tab = "verified" | "pending" | "reject" | "block";

export interface FilterStore {
    page: number;
    row: number;
    tab: Tab;
    search: string;
    regional: string;
    witel: string;
    role: string;
    set: (data: object) => void;
    reset: () => void;
}

const filterDefaultValue = {
    page: 1,
    row: 10,
    tab: "verified" as Tab,
    search: "",
    regional: "",
    witel: "",
    role: "",
};

export const useFilterStore = create<FilterStore>((set) => ({
    ...filterDefaultValue,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set(filterDefaultValue),
}));
