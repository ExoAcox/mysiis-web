import React from "react";
import { describe, vi } from "vitest";

import { axios, fireEvent, render, screen, user } from "@functions/test";

import Home from "@pages/home";

vi.mock("next/router", () => ({
    useRouter: () => ({
        query: { unauthorized: "" },
        push: vi.fn(),
    }),
}));

vi.mock("react-horizontal-scrolling-menu");

describe("Home page", () => {
    axios.post.mockResolvedValue({
        data: {
            data: {
                accessToken: "token",
            },
        },
    });

    axios.get.mockResolvedValue({
        data: {
            data: {
                lists: [
                    {
                        id: "id",
                        title: "title",
                        article: "article",
                    },
                ],
            },
        },
    });

    test("Test snapshot", async () => {
        const view = render(<Home user={user} device="desktop" />);
        await vi.dynamicImportSettled();
        view.asFragment();
    });

    test("Search & filter portofolio", async () => {
        render(<Home user={user} device="desktop" />);
        await vi.dynamicImportSettled();

        const search = screen.getByPlaceholderText("Masukan nama portofolio");
        fireEvent.change(search, { target: { value: "odp" } });

        const searchReset = screen.getByTitle("search-reset");
        fireEvent.click(searchReset);
    });
});
