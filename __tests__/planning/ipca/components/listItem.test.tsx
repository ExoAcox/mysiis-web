import { describe, test } from "vitest";

import { render } from "@functions/test";

import ListItem from "@features/planning/ipca/components/ListItem";

describe("testing component ipca", () => {
    test("test ListItem", () => {
        render(<ListItem title={"title"} value={"value"} />).asFragment();
    });
});
