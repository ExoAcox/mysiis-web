import { getKabupaten, getProvinsi } from "@api/district/metadata"
import { errorHelper } from "@functions/common";
import { useListKota, useListProvinsi } from "../store"


const fetchProvinsi = async () => {
  try {
    const data_provinsi = await getProvinsi();
    const data: { label: string; value: string; }[] = data_provinsi.map(e => ({ label: e.provinsi, value: e.provinsi }))
    useListProvinsi.setState({
      data: data
    })
  } catch (error) {
    useListProvinsi.setState({
      error: errorHelper(error)
    })
  }
}


const fetchKabupaten = async (provinsi: string) => {
  try {
    const data_kota = await getKabupaten({ provinsi });
    const data = data_kota.map(e => ({ label: e.kota, value: e.kota, latLng: { lat: e.lat, lng: e.long } }))
    useListKota.setState({
      data
    })
  } catch (error) {
    useListProvinsi.setState({
      error: errorHelper(error)
    })
  }
}

export {
  fetchProvinsi,
  fetchKabupaten
}