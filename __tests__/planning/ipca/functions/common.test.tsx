import { exportCsv } from "@features/planning/ipca/functions/common";
import { describe, test } from "vitest";

describe('function ipca', () => {
  test('should exportCsv', () => {

    const data = [
      {
        cluster_id: 'string',
        code_sto: 'string',
        device_id: 3,
        devicename: 'string',
        deviceportnumber: 3,
        f_olt: 'string',
        geom_point: 'string',
        kandatel: 'string',
        lat: 3,
        long: 3,
        networklocationcode: 'string',
        odc_name: 'string',
        odp_install: 'string',
        portblockednumber: 3,
        portidlenumber: 3,
        portinservicenumber: 3,
        portreservednumber: 3,
        regional: 'string',
        status_occ: 'string',
        stoname: 'string',
        tgl_proses: 'string',
        updated_date: 'string',
        updated_mysiis: 'string',
        valins_id: 'string',
        witel: 'string',
      }
    ]

    exportCsv(data)
  })
})