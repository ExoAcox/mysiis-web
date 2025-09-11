import { getKabupaten, getKecamatan, getKelurahan, getProvinsi } from "@api/district/metadata";
import { errorHelper } from "@functions/common";
import { useKabupatenStore, useKecamatanStore, useKelurahanStore, useProvinsiStore } from "../../store/address";

export const defaultOption = {
  provinsi: '',
  kabupaten: '',
  kecamatan: '',
  kelurahan: ''
}

export const fetchProvinsi = async () => {
  useProvinsiStore.setState({ status: 'pending' })
  try {
    const data_provinsi = await getProvinsi();
    const data: { label: string; value: string; }[] = data_provinsi.map(e => ({ label: e.provinsi, value: e.provinsi }))
    useProvinsiStore.setState({
      provinsi: data
    })
  } catch (error) {
    useProvinsiStore.setState({
      error: errorHelper(error), status: 'reject'
    })
  }
}

export const fetchKabupaten = async ({ provinsi }: { provinsi: string }) => {
  useKabupatenStore.setState({ status: 'pending' })
  try {
    const data_kabupaten = await getKabupaten({ provinsi });
    const data: { label: string; value: string; }[] = data_kabupaten.map(e => ({ label: e.kota, value: e.kota }))
    useKabupatenStore.setState({
      kabupaten: data
    })
  } catch (error) {
    useKabupatenStore.setState({
      error: errorHelper(error), status: 'reject'
    })
  }
}

export const fetchKecamatan = async (args: { provinsi: string, kabupaten: string }) => {
  useKecamatanStore.setState({ status: 'pending' })
  try {
    const data_kecamatan = await getKecamatan(args);
    const data: { label: string; value: string; }[] = data_kecamatan.map(e => ({ label: e.kecamatan, value: e.kecamatan }))
    useKecamatanStore.setState({
      kecamatan: data
    })
  } catch (error) {
    useKecamatanStore.setState({
      error: errorHelper(error), status: 'reject'
    })
  }
}

export const fetchKelurahan = async (args: { provinsi: string, kabupaten: string, kecamatan: string }) => {
  useKelurahanStore.setState({ status: 'pending' })
  try {
    const data_kelurahan = await getKelurahan(args);
    const data: { label: string; value: string; }[] = data_kelurahan.map(e => ({ label: e.kelurahan, value: e.kelurahan }))
    useKelurahanStore.setState({
      kelurahan: data,
      listKelurahan: data_kelurahan
    })
  } catch (error) {
    useKelurahanStore.setState({
      error: errorHelper(error), status: 'reject'
    })
  }
}