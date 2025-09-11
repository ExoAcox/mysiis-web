import { GetBuildingIpca, UimIpcaById } from "@api/addons/ipca"
import csvDownload from "json-to-csv-export";

export const formatAllOdp = (odpUim: UimIpcaById[]) => {
  const data = {
    total_odp: odpUim.length,
    green: odpUim.filter(e => e.status_occ == 'GREEN').length,
    yellow: odpUim.filter(e => e.status_occ == 'YELLOW').length,
    red: odpUim.filter(e => e.status_occ == 'RED').length,
    orange: odpUim.filter(e => e.status_occ == 'ORANGE').length,
    black_green: odpUim.filter(e => e.status_occ == 'BLACK_SYSTEM').length,
    black: odpUim.filter(e => e.status_occ == 'BLACK_NOT_SYSTEM').length,
  }
  return data
}

export const exportCsv = (array: UimIpcaById[] | GetBuildingIpca[]) => {
  const dataToConvert = {
    data: array,
    filename: `Laporan_ipca.csv`,
    delimiter: ",",
  };
  csvDownload(dataToConvert);
};

export const regionals = [
  'Regional 1',
  'Regional 2',
  'Regional 3',
  'Regional 4',
  'Regional 5',
  'Regional 6',
  'Regional 7',
]