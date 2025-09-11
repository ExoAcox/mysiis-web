import { create } from "zustand";

export interface SurveyCountStore {
    userId: string;
    name: string | undefined;
    witel: string | undefined;
    mitra: string | undefined;
    supervisor_name: string | undefined;
    valid: string;
    validMitra: number;
    invalid: number;
    unvalidated: string;
    target: string | number;
    objectid: number;
    total: number;
    status?: string;
    progress: string | number;
    dokumen_bakp: string;
}

export const useSurveyCountStore = create<Store<SurveyCountStore[]>>((set) => ({
    data: [],
    status: "idle",
    error: null,
    set: (data) => set(data),
    reset: () => set({ data: [], status: "idle", error: null }),
}));

interface SurveyCountWitelStore {
    invalid: string;
    unvalidated: string;
    valid: string;
    validMitra: number;
    witel: string;
    total: number;
}

export const useSurveyCountWitelStore = create<Store<SurveyCountWitelStore[]>>((set) => ({
    data: [],
    status: "idle",
    error: null,
    set: (data) => set(data),
    reset: () => set({ data: [], status: "idle", error: null }),
}));

const optionDefault = [{ label: "", value: "" }];

export const useWitelStore = create<Store<Option<string>[]>>((set) => ({
    data: optionDefault,
    status: "idle",
    error: null,
    set: (data) => set(data),
    reset: () => set({ data: optionDefault, status: "idle", error: null }),
}));

export const useSurveyCategorylStore = create<Store<Option<string>[]>>((set) => ({
    data: [{ label: "Survey Microdemand", value: "1" }],
    status: "idle",
    error: null,
    set: (data) => set(data),
    reset: () => set({ data: [{ label: "Survey Microdemand", value: "1" }], status: "idle", error: null }),
}));
