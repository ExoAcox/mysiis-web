import { fetchBuildingByKelurahan, fetchReportData } from "@features/planning/odp-area/queries/building_by_kelurahan";
import { axios } from "@functions/test";
import { describe, test } from "vitest";

const dataBuilding = {
  lists: [
    {
      id: 0,
      sumber: 'string',
      geom: 'POLYGON ((-3.706512451171875 40.420074462890625, -3.70513916015625 40.420074462890625, -3.70513916015625 40.42144775390625, -3.706512451171875 40.42144775390625, -3.706512451171875 40.420074462890625))',
      kode_desa: 'string',
      provinsi: 'string',
      kota: 'string',
      kecamatan: 'string',
      kelurahan: 'string',
    }
  ],
  countTotal: 0,
  countPage: 0,
}

describe('testing queries building kelurahan', () => {
  test('testing fetchBuildingByKelurahan resolve', () => {
    axios.get.mockResolvedValueOnce({ data: { data: dataBuilding } })
    fetchBuildingByKelurahan('1', 'district-building')
  })
  test('testing fetchBuildingByKelurahan reject', () => {
    axios.get.mockResolvedValueOnce({ data: { data: 'dataBuilding' } })
    fetchBuildingByKelurahan('1', 'district-building')
  })
  test('testing fetchReportData', () => {
    fetchReportData()
  })
})