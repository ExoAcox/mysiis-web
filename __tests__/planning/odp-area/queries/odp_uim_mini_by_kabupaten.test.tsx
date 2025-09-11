import { fetchOdpUimMiniByKabupaten } from "@features/planning/odp-area/queries/odp_uim_mini_by_kabupaten"
import { axios } from "@functions/test"
import { describe, test } from "vitest"

describe('testing queries odp uim mini kabupaten', () => {
  test('testing fetchOdpUimMiniByKabupaten resolve', () => {
    axios.get.mockResolvedValueOnce({
      data: {
        data: {
          long: 3,
          lat: 3,
        }
      }
    })
    fetchOdpUimMiniByKabupaten('DKI Jakarta', 'jakarta', 'district-heatmap')
  })
})