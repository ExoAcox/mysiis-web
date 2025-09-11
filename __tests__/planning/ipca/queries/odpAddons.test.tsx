import { fetchBuildingIpca } from "@features/planning/ipca/queries/odpAddons";
import { axios } from "@functions/test";
import { describe, test } from "vitest";

describe('quesries ipca', () => {

  test('should fetchBuildingIpca', () => {

    axios.get.mockResolvedValueOnce({
      data: {
        data: [
          {
            geom: 'POLYGON ((-3.706512451171875 40.420074462890625, -3.70513916015625 40.420074462890625, -3.70513916015625 40.42144775390625, -3.706512451171875 40.42144775390625, -3.706512451171875 40.420074462890625))',
            id: 3,
            id_project: 'string',
            sumber: 'string'
          }
        ]
      }
    })

    fetchBuildingIpca({
      cluster_id: 3,
      id_project: 3,
      jumlah_huni: 3,
      potensi_hh: 3,
      nama_lop: 'string',
      nama_segment: 'string',
      kode_desa: 'string',
      kelurahan: 'string',
      kecamatan: 'string',
      kabupaten: 'string',
      provinsi: 'string',
      regional: 'string',
      witel: 'string',
      status_priority: "PRIORITY",
      geom: 'POLYGON ((-3.706512451171875 40.420074462890625, -3.70513916015625 40.420074462890625, -3.70513916015625 40.42144775390625, -3.706512451171875 40.42144775390625, -3.706512451171875 40.420074462890625))'
    })
  })

})