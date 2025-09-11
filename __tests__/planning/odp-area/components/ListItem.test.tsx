import ListItem from "@features/planning/odp-area/components/ListItem";
import { render } from "@functions/test";
import { describe, expect } from "vitest";

describe('CheckBoxOdpArea', () => {

  test('should snapshoot CheckBoxOdpArea', () => {

    const container = render(<ListItem subTitle={"content"} />).asFragment()
    expect(container).matchSnapshot()
  })


})