import { create } from "zustand";

import { News } from "@api/news";

interface NewsStore {
    lists: News[];
    countFiltered: number;
}

export const useNewsStore = create<Store<NewsStore | null>>((set) => ({
    data: null,
    status: "idle",
    error: null,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set((state) => ({ ...state, data: null, status: "idle", error: null })),
}));

export const useDetailNewsStore = create<Store<News | null>>((set) => ({
    data: null,
    status: "idle",
    error: null,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set((state) => ({ ...state, data: null, status: "idle", error: null })),
}));
