import dayjs from "dayjs";
import { create } from "zustand";

import { User } from "@api/account/user";
import { Respondent } from "@api/survey-demand/respondent";
import { GetSummaryDetail } from "@api/survey-demand/summary";

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

export interface Filter {
    startDate: string;
    endDate: string;
    page: number;
    row: number;
    searchType: string;
    search: string;
    regional: string;
    witel: string;
    vendor: string;
    status: string;
    role: string;
    surveyor: string;
    polygon: string;
    category: SurveyCategory;
}

export interface FilterStore extends Filter {
    set: (data: object) => void;
    reset: () => void;
}

export enum SurveyCategory {
    DEFAULT = "1",
    PELANGGAN = "6",
    JARINGAN = "7",
    EVIDANCE = "9",
    UNSC = "10",
}

export const filterDefaultValue = {
    startDate: dayjs().startOf("year").format("YYYY-MM-DD"),
    endDate: dayjs().format("YYYY-MM-DD"),
    page: 1,
    row: 10,
    searchType: "name",
    search: "",
    regional: "",
    witel: "",
    vendor: "",
    status: "",
    role: "",
    surveyor: "",
    polygon: "",
    category: SurveyCategory.DEFAULT,
};

export const useFilterStore = create<FilterStore>((set) => ({
    ...filterDefaultValue,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set(filterDefaultValue),
}));

export interface FilterSummary {
    page: number;
    row: number;
    area: string;
    region?: string;
    branch?: string;
    vendor?: string;
    search?: string;
}

export interface FilterSummaryStore extends FilterSummary {
    set: (data: object) => void;
    reset: () => void;
}
export const filterSummaryDefaultValue = {
    page: 1,
    row: 10,
    area: "",
    region: "",
    branch: "",
    vendor: "",
    search: "",
};

export const useFilterSummaryStore = create<FilterSummaryStore>((set) => ({
    ...filterSummaryDefaultValue,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set(filterSummaryDefaultValue),
}));

interface SummaryStore extends Store<GetSummaryDetail[]> {
    grandTotal: GetSummaryDetail;
}

export const SummaryDefaultValue = {
    area: "",
    region: "",
    branch: "",
    assignment_polygon: {
        done: 0,
        not_yet: 0,
        total: 0,
    },
    permit_polygon: {
        not_yet: 0,
        yes: 0,
        process: 0,
        no: 0,
        total: 0,
    },
    total_survey_polygon: {
        low: 0,
        medium: 0,
        high: 0,
        finish: 0,
        pending: 0,
        design: 0,
        drop: 0,
        total: 0,
    },
    total_survey: {
        unvalidated: 0,
        valid_mitra: 0,
        valid: 0,
        invalid: 0,
        total: 0,
    },
    total_polygon_permits: {
        waiting: 0,
    },
    achievement_all: {
        target_household: 0,
        progress: 0,
    },
    achievement_assign: {
        target_household: 0,
        progress: 0,
    },
}

export const useSummaryStore = create<SummaryStore>((set) => ({
    data: [],
    grandTotal: SummaryDefaultValue,
    status: "pending",
    error: null,
    set: (data) => set((state) => ({ ...state, ...data })),
    reset: () => set({ data: [], status: "pending", error: null }),
}));