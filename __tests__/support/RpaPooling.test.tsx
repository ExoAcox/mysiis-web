import React from "react";
import { describe, vi } from "vitest";

import { uploadPooling } from "@api/rpa/pooling";

import { axios, fireEvent, render, screen, user, waitFor } from "@functions/test";

import RpaPooling from "@pages/support/rpa-pooling";

const getPooling = () => {
    axios.get.mockResolvedValueOnce({});
    axios.get.mockResolvedValueOnce({});
    axios.get.mockResolvedValueOnce({
        data: {
            data: [
                { id: "id1", filename: "pooling", status: "FINISHED" },
                { id: "id2", filename: "pooling", status: "REQUESTED" },
                { id: "id3", filename: "pooling", status: "FAILED" },
            ],
            meta: { count: 20 },
        },
    });
};

describe("Rpa Pooling Page", () => {
    test("Test snapshot", async () => {
        getPooling();
        const view = render(<RpaPooling user={user} />);
        view.asFragment();
    });

    test("Download data", async () => {
        getPooling();

        vi.useFakeTimers();
        render(<RpaPooling user={user} />);

        const downloadButton = await screen.findAllByText("Download");
        fireEvent.click(downloadButton[1]);

        await waitFor(() => screen.findByText("100%"));
        vi.advanceTimersByTime(4000);
    });

    test("Upload data", async () => {
        getPooling();

        vi.useFakeTimers();
        render(<RpaPooling user={user} />);

        const uploadButton = screen.getByText("Upload");
        fireEvent.click(uploadButton);

        axios.post.mockResolvedValue({ data: { data: {} } });
        const dropArea = screen.getByText("Tarik & Lepaskan disini atau cari file di komputer Anda");
        fireEvent.drop(dropArea, {
            dataTransfer: {
                files: [
                    {
                        type: "text/csv",
                        size: 1000,
                    },
                ],
            },
        });

        await waitFor(() => screen.findByText("100%"));
        vi.advanceTimersByTime(1000);

        const successButton = await screen.findByText("OKE");
        fireEvent.click(successButton);
    });
});
