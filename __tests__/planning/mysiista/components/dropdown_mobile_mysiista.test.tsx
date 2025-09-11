import { describe, test } from "vitest";

import { fireEvent, render, screen } from "@functions/test";

import Dropdown from "@features/planning/mysiista/components/ModalDrawingPolygon/Mobile/Dropdown";
import ModalForm from "@features/planning/mysiista/components/ModalDrawingPolygon/Mobile/ModalForm";

describe("testing mysiista mobile component", () => {
    test("should dropdown", async () => {
        render(<Dropdown />).asFragment();

        const btnDropdown = screen.getByTestId("btn-test-dropdown");
        fireEvent.click(btnDropdown);
        const btnDropdownPrioritas = screen.getAllByTestId("btn-prioritas")[0];
        fireEvent.click(btnDropdownPrioritas);
    });

    test("should modalInput", () => {
        render(<ModalForm device={"mobile"} />).asFragment();
    });
});
