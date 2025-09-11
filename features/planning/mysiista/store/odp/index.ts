import { create } from "zustand";

interface StoreMySiista<Value> {
    set: (data: Value) => void;
    reset: () => void;
}

interface SourceStore extends StoreMySiista<"uim" | "valins"> {
    source: "uim" | "valins";
    radius: number;
}

export const useSourceastore = create<SourceStore>((set) => ({
    source: "uim",
    radius: 200,
    set: (data) => set((state) => ({ ...state, source: data })),
    reset: () => set(() => ({ source: "uim" })),
}));

interface StreetSore extends StoreMySiista<string> {
    street: string;
    status: DataStatus;
    error: DataError;
}

export const useStreetStore = create<StreetSore>((set) => ({
    street: "",
    status: "idle",
    error: null,
    set: (data) => set((state) => ({ ...state, data: data })),
    reset: () => set(() => ({ street: "", status: "idle", error: null })),
}));

interface OdpPrecentStore extends StoreMySiista<string> {
    odp_precent: string;
    status: DataStatus;
    error: DataError;
}

export const useOdpPercentStore = create<OdpPrecentStore>((set) => ({
    odp_precent: "",
    status: "idle",
    error: null,
    set: (odp_precent) => set((state) => ({ ...state, odp_precent: odp_precent })),
    reset: () => set(() => ({ odp_precent: "", status: "idle", error: null })),
}));
