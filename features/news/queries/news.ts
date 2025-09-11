import { getAllNews, getNews } from "@api/news";

import { errorHelper } from "@functions/common";

import { useDetailNewsStore, useNewsStore } from "../store";

export const fetchAllNews = async ({ page, row = 16 }: { page: number, row: number }) => {
    useNewsStore.setState({ data: null, status: "pending", error: null });
    try {
        const news = await getAllNews({ row, page, status: true });

        useNewsStore.setState({ data: news, status: "resolve" });
    } catch (error) {
        useNewsStore.setState({ status: "reject", error: errorHelper(error) });
    }
};

export const fetchDetailNews = async (id: string) => {
    useDetailNewsStore.setState({ data: null, status: "pending", error: null });
    try {
        const news = await getNews(id);

        useDetailNewsStore.setState({ data: news, status: "resolve" });
    } catch (error) {
        useDetailNewsStore.setState({ status: "reject", error: errorHelper(error) });
    }
};
