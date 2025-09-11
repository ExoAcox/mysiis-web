import { fetchOdpUimByKelurahan } from "@features/planning/odp-area/queries/odp_uim_by_kelurahan";
import { axios } from "@functions/test";
import { describe, test } from "vitest";

describe('odp uim by kelurahan', () => {

  test('testing fetchOdpUimByKelurahan', () => {

    const data =
    {
      summary: {
        total_port: {
          portidlenumber: 0,
          deviceportnumber: 0,
        },
        status_occ_add: {
          red: 0,
          orange: 0,
          yellow: 0,
          green: 0,
          black_system: 0,
          black: 0,
        },
      },
      lists: [
        {
          device_id: 0,
          devicename: 'string',
          lat: 0,
          long: 0,
          status_occ_add: 'GREEN',
          portidle0: 'string',
          deviceport0: 'string',
          odp: 'string',
          updated_mysiis: 'string',
          networklocationcode: 'string',
          code_sto: 'string',
          portinservicenumber: 0,
          odp_install: 'string',
        }
      ]
    }

    axios.get.mockResolvedValueOnce({ data: { data: data } })
    fetchOdpUimByKelurahan('1', 'district-odp')

  })

})