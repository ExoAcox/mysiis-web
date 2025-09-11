import { fetchSummaryOdpUimValins } from "@features/planning/odp-area/queries/summary_odp_uim_valins"
import { axios } from "@functions/test"
import { describe, test } from "vitest"
import { googleMaps, InfoWindow, Polygon } from '@exoacox/google-maps-vitest-mocks'
import { odpAreaPolygonsOdpSumaary } from "@pages/planning/odp-area/odp-summary"

googleMaps()
InfoWindow()
Polygon()

describe('testing queries odp uim mini kabupaten', () => {
  test('testing fetchOdpUimMiniByKabupaten resolve', () => {
    axios.get.mockResolvedValueOnce({
      data: {
        data: [
          {
            _id: 'string',
            id_kab: 3,
            kecamatan: 'mutiara',
            kelurahan: 'kedung rejo',
            kode_desa_dagri: 'string',
            kota: 'string',
            last_updated_at: 'string',
            lat: 3,
            long: 3,
            odp_uim_count: 3,
            odp_uim_deviceportnumber: 3,
            odp_uim_portidlenumber: 3,
            odp_uim_portinservicenumber: 3,
            odp_uim_portreservednumber: 3,
            odp_uim_unknownportnumber: 3,
            odp_valins_count: 3,
            odp_valins_deviceportnumber: 3,
            odp_valins_portidlenumber: 3,
            polygon_kel: 'string',
            provinsi: 'string',
          }
        ]
      }
    })
    odpAreaPolygonsOdpSumaary.push({
      ...Polygon,
      kelurahan: 'kedung rejo',
      kecamatan: 'mutiara'
    })
    fetchSummaryOdpUimValins('DKI Jakarta', 'jakarta')
  })
})