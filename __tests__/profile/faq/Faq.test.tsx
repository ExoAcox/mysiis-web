import React from "react";
import { describe } from "vitest";

import { axios, fireEvent, render, screen, user, waitFor } from "@functions/test";

import Faq from "@pages/profile/faq";

const renderPage = async (args?: { access: Access }) => {
    const { access = "allowed" } = args || {};

    const view = render(<Faq user={user} access={access} />);

    return view;
};

const getFaqAllCategoryActive = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: [
                {
                    key: "mysiis-faq-fulfilment",
                    label: { id: "Fulfilment" },
                    answer: { id: "Fulfilment" },
                },
                {
                    key: "mysiis-faq-support",
                    label: { id: "Support" },
                    answer: { id: "Support" },
                },
            ],
        },
    });
};

const getFaqAllCategoryActiveEmpty = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: [],
        },
    });
};

const getFaqByCategory = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: [
                {
                    key: "key 1",
                    label: { id: "label 1" },
                    answer: { id: "answer 1" },
                },
                {
                    key: "key 2",
                    label: { id: "label 2" },
                    answer: { id: "answer 2" },
                },
            ],
        },
    });
};

const getFaqByPopularity = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: {
                lists: [
                    {
                        key: "key 1",
                        label: { id: "label 1" },
                        answer: { id: "answer 1" },
                    },
                    {
                        key: "key 2",
                        label: { id: "label 2" },
                        answer: { id: "answer 2" },
                    },
                ],
            },
        },
    });
};

const getFaqBySearch = () => {
    return axios.get.mockResolvedValueOnce({
        data: {
            data: {
                lists: [
                    {
                        key: "key 1",
                        label: { id: "label 1" },
                        answer: { id: "answer 1" },
                    },
                    {
                        key: "key 2",
                        label: { id: "label 2" },
                        answer: { id: "answer 2" },
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

describe("Faq page", () => {
    test("Test snapshot", async () => {
        getCredential();
        axios.get.mockResolvedValueOnce({});
        axios.get.mockResolvedValueOnce({});
        getFaqAllCategoryActiveEmpty();
        getFaqByPopularity();

        const view = await renderPage();
        view.asFragment();
    });

    test("Faq component getFaqAllCategoryActiveEmpty", async () => {
        axios.get.mockResolvedValueOnce({});
        getFaqAllCategoryActive();
        getFaqByPopularity();
        getFaqByCategory();
        getFaqByCategory();
        getFaqBySearch();

        await renderPage();
        await waitFor(() => null);

        const input = screen.getByPlaceholderText("Cari Pertanyaan Terkait mySIIS");

        fireEvent.change(input, { target: { value: "question" } });

        fireEvent.change(input, { target: { value: "" } });

        fireEvent.change(input, { target: { value: "question" } });

        const icon = screen.getByTitle("reset-search");
        fireEvent.click(icon);
    });

    test("Faq component", async () => {
        axios.get.mockResolvedValueOnce({});
        getFaqAllCategoryActive();
        getFaqByPopularity();
        getFaqByCategory();
        getFaqByCategory();
        getFaqBySearch();

        await renderPage();
        await waitFor(() => null);

        const support = screen.getByText("Support");
        fireEvent.click(support);

        const input = screen.getByPlaceholderText("Cari Pertanyaan Terkait mySIIS");

        fireEvent.change(input, { target: { value: "question" } });

        fireEvent.change(input, { target: { value: "" } });

        fireEvent.change(input, { target: { value: "question" } });

        const icon = screen.getByTitle("reset-search");
        fireEvent.click(icon);
    });
});
