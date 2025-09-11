import { fetchSummaryPenetrasiOdpBuilding } from "@features/planning/odp-area/queries/summary_penetration_odp_building"
import { axios, fireEvent, render, screen } from "@functions/test"
import { describe, test, vi } from "vitest"
import { googleMaps, InfoWindow, Polygon } from "@exoacox/google-maps-vitest-mocks";
import { districtSummaryPolygons } from "@pages/planning/odp-area/district-summary";
import InfoDistrictSummary from "@features/planning/odp-area/components/InfoDistrictSummary";
import { useSummaryPenetrasiOdpBuildingStore } from "@features/planning/odp-area/store";

googleMaps()
InfoWindow()
Polygon()

const dataSummaryPenetration = [
  {
    _id: 'string',
    st_name: 'string',
    kode_desa_dagri: 'string',
    kelurahan: 'string',
    kecamatan: 'string',
    kota: 'string',
    provinsi: 'string',
    long: 3,
    lat: 3,
    odp_portidlenumber: 3,
    odp_deviceportnumber: 3,
    odp_count: 3,
    building_count: 3,
    penetrasi_percent: 3,
    last_updated_at: 'string'
  }
]
describe('testing queries odp uim mini kabupaten', () => {
  test('testing fetchOdpUimMiniByKabupaten resolve', () => {
    axios.get.mockResolvedValueOnce({
      data: {
        data: dataSummaryPenetration
      }
    })
    districtSummaryPolygons.push({
      ...Polygon(),
      setOptions: vi.fn().mockResolvedValueOnce(() => ({ fillColor: 'red', fillOpacity: 0.3 })),
      kelurahan: 'string',
      kecamatan: 'string',
    })
    fetchSummaryPenetrasiOdpBuilding('DKI Jakarta', 'jakarta')
  })

  test('should testing distric summary', async () => {
    const props = {
      isOpen: true,
      setOpen: vi.fn(),
      mode: 'penetration',
      setMode: vi.fn()
    }
    useSummaryPenetrasiOdpBuildingStore.setState({ status: 'resolve' })
    render(<InfoDistrictSummary {...props} />)
    const btnPenetration = screen.getByText('Penetrasi')
    fireEvent.click(btnPenetration)
  })
})