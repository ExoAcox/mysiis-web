import { useQuery } from "@tanstack/react-query";
import { create } from "zustand";

import { GetAllParams, getAllBanner, getAllNews } from "@api/news";

import portofolios from "@data/portofolio";

export const useNews = (params: GetAllParams) => {
    return useQuery({
        queryKey: ["news/getAllNews", params],
        queryFn: () => getAllNews(params),
    });
};

export const useBanner = (params: GetAllParams) => {
    return useQuery({
        queryKey: ["news/getAllBanner", params],
        queryFn: () => getAllBanner(params),
    });
};

export const usePortofolioStore = create<{ data: Portofolio[]; set: (data: []) => void; reset: () => void }>((set) => ({
    data: portofolios,
    set: (data) => set({ data }),
    reset: () => set({ data: portofolios }),
}));

export const categoriesDefault = usePortofolioStore
    .getState()
    .data.map((e) => e.category)
    .filter((item, i, ar) => ar.indexOf(item) === i);

export const useCategoriesStore = create<{ data: Portofolio["category"][]; set: (data: []) => void; reset: () => void }>((set) => ({
    data: categoriesDefault,
    set: (data) => set({ data }),
    reset: () => set({ data: categoriesDefault }),
}));
