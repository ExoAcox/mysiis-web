import React from "react";
import { describe } from "vitest";

import { axios, fireEvent, render, screen, user } from "@functions/test";

import NewsDetail from "@pages/news/[newsId]";

const renderPage = async (args?: { device?: Device }) => {
    const { device = "desktop" } = args || {};

    const view = render(<NewsDetail user={user} device={device} />);

    return view;
};

const getNews = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: {
                lists: [
                    {
                        id: "id_1",
                        title: "Title 1",
                        article: "Article 1",
                        image_url: "image_url_1",
                        updated_at: "2012-12-12",
                        created_at: "2012-12-12",
                        view_count: 1,
                        doc: "documents/Fri-Jun-17-2022-14:29:05-GMT+0700-(Western-Indonesia-Time)-63232d44-cf44-4b93-88c9-5ffc3712acd3-SOP mySIIS WEB v1.0.pdf",
                        doc_urls: ["doc_url_1"],
                    },
                ],
            },
        },
    });
};

const getNewsInvalidDoc = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: {
                lists: [
                    {
                        id: "id_1",
                        title: "Title 1",
                        article: "Article 1",
                        image_url: "image_url_1",
                        updated_at: "2012-12-12",
                        created_at: "2012-12-12",
                        view_count: 1,
                        doc: "",
                        doc_urls: ["doc_url_1"],
                    },
                ],
            },
        },
    });
};

const getCredential = () => {
    return axios.post.mockResolvedValue({
        data: {
            data: {
                accessToken: "accessToken",
                refreshToken: "refreshToken",
            },
        },
    });
};

describe("News Detail page", () => {
    test("Test snapshot", async () => {
        getCredential();
        axios.get.mockResolvedValueOnce({});
        axios.get.mockResolvedValueOnce({});
        getNews();

        const view = await renderPage();
        view.asFragment();
    });

    test("News error 404 get all news data", async () => {
        axios.get.mockResolvedValueOnce({});
        axios.get.mockRejectedValueOnce({ response: { data: { code: 404 } } });

        renderPage();
    });

    test("News success get all news data but invalid doc", async () => {
        axios.get.mockResolvedValueOnce({});
        getNewsInvalidDoc();

        renderPage();
    });

    test("News success get all news data but invalid doc", async () => {
        axios.get.mockResolvedValueOnce({});
        getNewsInvalidDoc();

        renderPage();
    });
});
