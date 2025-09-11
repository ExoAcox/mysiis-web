import { axios, catchHelper, header } from "@libs/axios";

export interface SummaryOdpUimValins {
  _id: string,
  kecamatan: string,
  kelurahan: string
  kode_desa_dagri: string,
  kota: string,
  last_updated_at: string,
  lat: number,
  long: number,
  odp_uim_count: number,
  odp_uim_deviceportnumber: number,
  odp_uim_portidlenumber: number
  odp_valins_count: number,
  odp_valins_deviceportnumber: number
  odp_valins_portidlenumber: number
  provinsi: string,
}

export interface SummaryPenetration {
  _id: string,
  st_name: string,
  kode_desa_dagri: string,
  kelurahan: string,
  kecamatan: string,
  kota: string,
  provinsi: string,
  long: number,
  lat: number,
  odp_portidlenumber: number,
  odp_deviceportnumber: number,
  odp_count: number,
  building_count: number,
  penetrasi_percent: number,
  last_updated_at: string
}

let cancelOdpShummary: AbortController;


export const summaryOdpUimValins = (provinsi: string, kota: string): Promise<[DataOdpSummary]> => {
  if (cancelOdpShummary) cancelOdpShummary.abort();
  cancelOdpShummary = new AbortController();

  return new Promise((resolve, reject) => {
    axios
      .get(process.env.NEXT_PUBLIC_DISTRICT_URL + `/district/v1/summary/odp-uim-vs-valins?provinsi=${provinsi}&kabupaten=${kota}`, {
        headers: header(),
        signal: cancelOdpShummary.signal
      })
      .then((response) => {
        resolve(response.data.data);
      })
      .catch((error) => {
        catchHelper(reject, error)
      });
  });
};

export const summaryPenetrasiOdpBuilding = (provinsi: string, kota: string): Promise<[SummaryPenetration]> => {
  if (cancelOdpShummary) cancelOdpShummary.abort();
  cancelOdpShummary = new AbortController();

  return new Promise((resolve, reject) => {
    axios
      .get(process.env.NEXT_PUBLIC_DISTRICT_URL + `/district/v1/summary/penetrasi-odp-building?provinsi=${provinsi}&kabupaten=${kota}`, {
        headers: header(),
        signal: cancelOdpShummary.signal
      })
      .then((response) => {
        resolve(response.data.data);
      })
      .catch((error) => {
        catchHelper(reject, error)
      });
  });
};
