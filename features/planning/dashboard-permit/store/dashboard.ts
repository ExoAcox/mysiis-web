import { Respondent } from "@api/survey-demand/respondent";
import { SummaryPemitsData } from "@api/survey-demand/summary";
import dayjs from "dayjs";
import { create } from "zustand";

interface Summary {
    unvalidated: number;
    valid_mitra: number;
    valid: number;
    invalid: number;
}

interface SurveyStore extends Store<Respondent[]> {
    totalData: number;
    summary: Summary;
}

const SummaryDefault = {
    unvalidated: 0,
    valid_mitra: 0,
    valid: 0,
    invalid: 0,
};

export const useSurveyStore = create<SurveyStore>((set) => ({
    data: [],
    totalData: 0,
    summary: SummaryDefault,
    status: "pending",
    error: null,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set({ data: [], totalData: 0, status: "pending", error: null }),
}));

export interface Filter {
    page: number;
    row: number;
    startDate: string;
    endDate: string;
    regional: string;
    witel: string;
    polygon: string;
    status_permits?: string;
    category?: string;
    search?: string;
}

export interface FilterStore extends Filter {
    set: (data: object) => void;
    reset: () => void;
}

export const filterDefaultValue = {
    startDate: dayjs().startOf("year").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
    page: 1,
    row: 10,
    regional: "",
    witel: "",
    polygon: "",
    category: "1",
};

export const useFilterStore = create<FilterStore>((set) => ({
    ...filterDefaultValue,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set(filterDefaultValue),
}));

export interface FilterSummary {
    page: number;
    row: number;
    regional: string;
    witel: string;
    search: string;
}

export interface FilterSummaryStore extends FilterSummary {
    set: (data: object) => void;
    reset: () => void;
}
export const filterSummaryDefaultValue = {
    page: 1,
    row: 10,
    regional: "",
    witel: "",
    search: "",
};

export const useFilterSummaryStore = create<FilterSummaryStore>((set) => ({
    ...filterSummaryDefaultValue,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set(filterSummaryDefaultValue),
}));

interface SummaryPermitsStore extends Store<SummaryPemitsData[]> {
    grandTotal: SummaryPemitsData;
}

export const SummaryPermitsStoreDefault = {
    regional: "",
    witel: "",
    drop_pending: 0,
    permits_approved: {
        done: 0,
        ogp_survey: 0,
        total: 0,
    },
    permits_process: {
        done: 0,
        ogp_survey: 0,
    },
    permits_rejected: {
        done: 0,
        ogp_survey: 0,
        total: 0,
    },
    permits_not_yet: {
        done: 0,
        ogp_survey: 0,
        total: 0,
    },
    ihld_sent: {
        done: 0,
    }
}

export const useSummaryPermitsStore = create<SummaryPermitsStore>((set) => ({
    data: [],
    grandTotal: SummaryPermitsStoreDefault,
    status: "idle",
    error: null,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set({ data: [], status: "pending", error: null }),
}));