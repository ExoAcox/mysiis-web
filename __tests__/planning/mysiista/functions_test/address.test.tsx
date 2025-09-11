import { handleSetAddress } from "@features/planning/mysiista/function/address";
import { describe, test } from "vitest";

describe('testing function mysiista addressß', () => {
  test('should handleSetAddress', () => {
    handleSetAddress('kabupaten', {})
    handleSetAddress('kecamatan', {})
    handleSetAddress('kelurahan', {})
  })
})