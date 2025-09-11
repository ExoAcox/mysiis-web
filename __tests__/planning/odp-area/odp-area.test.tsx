import { render } from "@functions/test";
import OdpArea from "@pages/planning/odp-area";
import { describe, test } from "vitest";

describe('Odp Area Page', () => {

  test('testing page odp area', () => {
    render(<OdpArea />)
  })

})