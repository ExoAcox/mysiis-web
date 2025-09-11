import { useProfileStore } from "@libs/store";

import { intersection } from "@functions/common";

import portofolios from "@data/portofolio";

import { useCategoriesStore, usePortofolioStore } from "../store";

export const filterCategory = (category: string) => {
    const newPortofolio = portofolios
        .filter((portofolio) => {
            if (category === "all") return true;
            return portofolio.category === category;
        })
        .filter((portofolio) => {
            if (portofolio.guest) return true;
            return intersection(useProfileStore.getState()?.data.permission_keys, portofolio.permission).length;
        });

    const newCategory = newPortofolio.map((e) => e.category).filter((item, i, ar) => ar.indexOf(item) === i);
    useCategoriesStore.setState({ data: newCategory });
    usePortofolioStore.setState({ data: newPortofolio });
};

export const filterByName = (keyword: string): Portofolio[] => {
    const newPortofolio = portofolios
        .filter((portofolio) => {
            return portofolio.label.toLowerCase().includes(keyword.toLowerCase());
        })
        .filter((portofolio) => {
            if (portofolio.guest) return true;
            return intersection(useProfileStore.getState()?.data.permission_keys, portofolio.permission).length;
        });

    return newPortofolio;
};
