import React from "react";
import { describe } from "vitest";

import { fireEvent, render, screen } from "@functions/test";

import { FailedState, ProgressState, SuccessState } from "@features/planning/sentiment-feedback/components/modal/UploadModal/components";

describe("Sentiment feedback upload csv features", () => {
    test("Upload csv failed state", async () => {
        render(<FailedState setStatus={() => null} sendSentiment={() => null} dataMessage={null} />);

        const chooseFile = screen.getByText("Pilih File");
        fireEvent.click(chooseFile);
    });

    test("Upload csv failed state upload again", async () => {
        render(<FailedState setStatus={() => null} sendSentiment={() => null} dataMessage={null} />);

        const uploadAgain = screen.getByText("Upload Ulang");
        fireEvent.click(uploadAgain);
    });

    test("Upload csv progress state", async () => {
        render(<ProgressState progress={0} filename={"filename"} />);
    });

    test("Upload csv success state", async () => {
        render(<SuccessState setStatus={() => null} />);

        const chooseFile = screen.getByText("Oke");
        fireEvent.click(chooseFile);
    });
});
