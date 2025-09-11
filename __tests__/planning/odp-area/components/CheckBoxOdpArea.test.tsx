import { describe, expect, vi } from "vitest";

import { fireEvent, render, screen } from "@functions/test";

import CheckBoxOdpArea from "@features/planning/odp-area/components/CheckBoxOdpArea";

describe("CheckBoxOdpArea", () => {
    test("should snapshoot CheckBoxOdpArea", () => {
        const dataOption = [{ label: "Title", value: "content" }];

        const testFunc = vi.fn();

        render(<CheckBoxOdpArea value={"content"} options={dataOption} onChange={testFunc} />).asFragment();

        const item = screen.getByText("Title");
        fireEvent.click(item);
    });
});
