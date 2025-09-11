import { create } from "zustand";

import { User } from "@api/account/user";

import { Polygon } from "@api/survey-demand/mysiista";

export interface UserDataStore {
    regional: string;
    witel: string[];
    vendor: string;
    role: string;
    set: (data: object) => void;
    reset: () => void;
}

const userDataDefaultValue = {
    regional: "",
    witel: [],
    vendor: "",
    role: "",
};

export const useUserDataStore = create<UserDataStore>((set) => ({
    ...userDataDefaultValue,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set((state) => ({ ...state, ...userDataDefaultValue })),
}));

interface UserStore extends Store<User[]> {
    totalData: number;
}

export const useUserStore = create<UserStore>((set) => ({
    data: [],
    totalData: 0,
    status: "pending",
    error: null,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set({ data: [], totalData: 0, status: "pending", error: null }),
}));

export const usePolygonStore = create<Store<Polygon[]>>((set) => ({
    data: [],
    status: "pending",
    error: null,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set({ data: [], status: "pending", error: null }),
}));
