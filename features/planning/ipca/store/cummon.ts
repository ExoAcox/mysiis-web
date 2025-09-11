import { GetBuildingIpca, Ipca, UimIpcaById } from "@api/addons/ipca";
import { create } from "zustand";

interface StoreData<Data> {
  data: Data;
  status: DataStatus;
  error: DataError;
  set: (data: Data) => void;
  reset: () => void;
}

const defaultData: Ipca =
{
  cluster_id: 0,
  jumlah_huni: 0,
  potensi_hh: 0,
  nama_lop: '',
  nama_segment: '',
  kode_desa: '',
  kelurahan: '',
  kecamatan: '',
  kabupaten: '',
  provinsi: '',
  regional: '',
  witel: '',
  status_priority: 'PRIORITY',
  geom: ''
}

export const useIpcaStore = create<StoreData<Ipca[]>>((set) => ({
  data: [defaultData],
  status: 'idle',
  error: null,
  set: (data) => set(() => ({ data: data })),
  reset: () => set({ data: [defaultData] })
}))


export const usePolygonStore = create<StoreData<Ipca>>((set) => ({
  data: defaultData,
  status: 'idle',
  error: null,
  set: (data) => set(() => ({ data: data })),
  reset: () => set({ data: defaultData })
}))

const odpDefault: UimIpcaById = {
  cluster_id: '',
  code_sto: '',
  device_id: 0,
  devicename: '',
  deviceportnumber: 0,
  f_olt: '',
  geom_point: null,
  kandatel: '',
  lat: 0,
  long: 0,
  networklocationcode: '',
  odc_name: '',
  odp_install: '',
  portblockednumber: 0,
  portidlenumber: 0,
  portinservicenumber: 0,
  portreservednumber: 0,
  regional: '',
  status_occ: '',
  stoname: '',
  tgl_proses: '',
  updated_date: '',
  updated_mysiis: '',
  valins_id: null,
  witel: ''
}

export interface AllOdp {
  total_odp: number;
  green: number;
  yellow: number;
  red: number;
  orange: number;
  black_green: number;
  black: number;
}

const allOdpDefault = {
  total_odp: 0,
  green: 0,
  yellow: 0,
  red: 0,
  orange: 0,
  black_green: 0,
  black: 0,
}

export const useAllOdpData = create<StoreData<AllOdp>>((set) => ({
  data: allOdpDefault,
  status: 'idle',
  error: null,
  set: (data) => set(() => ({ data: data })),
  reset: () => set({ data: allOdpDefault })
}))

const allBuildingDefault: GetBuildingIpca = {
  geom: '',
  id: 0,
  id_project: '',
  sumber: ''
}

export const useAllBuildingData = create<StoreData<GetBuildingIpca[]>>((set) => ({
  data: [allBuildingDefault],
  status: 'idle',
  error: null,
  set: (data) => set(() => ({ data: data })),
  reset: () => set({ data: [allBuildingDefault] })
}))

export const useOdpData = create<StoreData<UimIpcaById>>((set) => ({
  data: odpDefault,
  status: 'idle',
  error: null,
  set: (data) => set(() => ({ data: data })),
  reset: () => set({ data: odpDefault })
}))

export const useDefaultAllDataOdpStore = create<StoreData<UimIpcaById[]>>((set) => ({
  data: [odpDefault],
  status: 'idle',
  error: null,
  set: (data) => set(() => ({ data: data })),
  reset: () => set({ data: [odpDefault] })
}))