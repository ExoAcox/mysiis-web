import { describe, expect, test } from "vitest";
import { mock } from "vitest-mock-extended";

describe("testing types odp-area", () => {
    test("should StoreSource", () => {
        const types = mock<StoreSource>();
        types.source = "string";

        function process(store: StoreSource) {
            return `test data ${store.source}`;
        }
        expect(process(types)).toBe("test data string");
    });
});
