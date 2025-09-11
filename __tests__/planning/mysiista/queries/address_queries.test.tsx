import { fetchKabupaten, fetchKecamatan, fetchKelurahan, fetchProvinsi } from "@features/planning/mysiista/queries/address";
import { useKabupatenStore, useKecamatanStore, useKelurahanStore, useProvinsiStore } from "@features/planning/mysiista/store/address";
import { axios, waitFor } from "@functions/test";
import { describe, test } from "vitest";

describe('testing quesries address', () => {

  test('fetch fetchProvinsi', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [{ provinsi: 'DKI JAKARTA' }] } })
    await waitFor(() => fetchProvinsi())
    const provinsi = useProvinsiStore.getState().provinsi
    expect(provinsi[0].label).toBe('DKI JAKARTA')
  })

  test('fetch fetchKabupaten', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [{ kota: 'JAKARTA' }] } })
    await waitFor(() => fetchKabupaten({ provinsi: 'DKI JAKARTA' }))
    const kabupaten = useKabupatenStore.getState().kabupaten
    expect(kabupaten[0].label).toBe('JAKARTA')
  })

  test('fetch fetchKecamatan', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [{ kecamatan: 'PANCORAN' }] } })
    await waitFor(() => fetchKecamatan({ provinsi: 'DKI JAKARTA', kabupaten: 'JAKARTA' }))
    const kecamatan = useKecamatanStore.getState().kecamatan
    expect(kecamatan[0].label).toBe('PANCORAN')
  })

  test('fetch fetchKelurahan', async () => {
    axios.get.mockResolvedValueOnce({ data: { data: [{ kelurahan: 'BALAI KOTA' }] } })
    await waitFor(() => fetchKelurahan({ provinsi: 'DKI JAKARTA', kabupaten: 'JAKARTA', kecamatan: 'PANCORAN' }))
    const kelurahan = useKelurahanStore.getState().kelurahan
    expect(kelurahan[0].label).toBe('BALAI KOTA')
  })

});