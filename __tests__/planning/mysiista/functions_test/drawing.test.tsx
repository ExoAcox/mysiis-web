import { handleDelete, handleDrawPolygon } from "@features/planning/mysiista/function/drawing";
import { describe, test } from "vitest";

describe('testing function mysiista drawing', () => {
  test('should handleDelete', () => {
    handleDelete()
    handleDrawPolygon()
  })
})