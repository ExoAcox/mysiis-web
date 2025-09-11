import React from "react";
import { describe } from "vitest";

import { axios, fireEvent, render, screen, user } from "@functions/test";

import News from "@pages/news";

const renderPage = async (args?: { device?: Device }) => {
    const { device = "desktop" } = args || {};

    const view = render(<News user={user} device={device} />);

    return view;
};

const listAllNews = Array.from({ length: 17 }, (_, index) => {
    return {
        id: `id_${index}`,
        title: `Title ${index}`,
        article: `Article ${index}`,
        image_url: `image_url_${index}`,
        updated_at: "2012-12-12",
        created_at: "2012-12-12",
        view_count: index,
        doc: `string ${index}`,
        doc_urls: [`string ${index}`],
    };
});

const getAllNews = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: {
                lists: listAllNews,
                countFiltered: 17,
            },
        },
    });
};

const getAllNewsEmpty = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: {
                lists: [],
                countFiltered: 0,
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

describe("News page", () => {
    test("Test snapshot", async () => {
        getCredential();
        axios.get.mockResolvedValueOnce({});
        axios.get.mockResolvedValueOnce({});
        getAllNews();

        const view = await renderPage();
        view.asFragment();
    });

    test("News error 404 get all news data", async () => {
        axios.get.mockResolvedValueOnce({});
        axios.get.mockRejectedValueOnce({ response: { data: { code: 404 } } });

        renderPage();
    });

    test("News success get all news data but empty", async () => {
        axios.get.mockResolvedValueOnce({});
        getAllNewsEmpty();

        renderPage();
    });

    // test("News success get all news data change pagination", async () => {
    //     axios.get.mockResolvedValueOnce({});
    //     getAllNews();

    //     renderPage();

    //     getAllNews();
    //     const changePagination = await screen.findByText("2");
    //     fireEvent.click(changePagination);
    // });

    test("News success get all news data", async () => {
        axios.get.mockResolvedValueOnce({});
        getAllNews();

        renderPage();

        const detailButton = await screen.findAllByText("Baca Selengkapnya");
        fireEvent.click(detailButton[0]);
    });
});
