interface StoreSource {
  source: string,
  setSource: (e: string) => void,
  resetStore: () => void
}

type SourceDistrictOdp = 'district-odp' | 'district-building' | 'district-heatmap'

interface DataOdpSummary {
  _id: string;
  id_kab: number,
  kecamatan: string;
  kelurahan: string;
  kode_desa_dagri: string;
  kota: string;
  last_updated_at: string;
  lat: number;
  long: number;
  odp_uim_count: number;
  odp_uim_deviceportnumber: number;
  odp_uim_portidlenumber: number;
  odp_uim_portinservicenumber: number;
  odp_uim_portreservednumber: number;
  odp_uim_unknownportnumber: number;
  odp_valins_count: number;
  odp_valins_deviceportnumber: number;
  odp_valins_portidlenumber: number;
  polygon_kel?: string;
  provinsi: string;
}
interface StoreOdpSummary {
  data: DataOdpSummary,
  set: (e: DataOdpSummary) => void,
  reset: () => void
}
interface StoreOdpUimValins {
  data: [SummaryOdpUimValins],
  set: (e: DataOdpSummary) => void,
  reset: () => void
}

interface DataSummary {
  "port_penetration": string,
  "port_readiness": string,
  "kecamatan": string,
  "kelurahan": string,
  "building": string,
  "odp_count": string,
  "device_port": string,
  "used_port": string,
  "idle_port": string,
}

interface DataDefaultSummaryTable {
  _id: string,
  "st_name": string,
  "kode_desa_dagri": string,
  "kelurahan": string,
  "kecamatan": string,
  "kota": string,
  "provinsi": string,
  "long": number,
  "lat": number,
  "odp_portidlenumber": number,
  "odp_deviceportnumber": number,
  "odp_count": number,
  "building_count": number,
  "penetrasi_percent": number,
  "last_updated_at": string
}

interface StoreSummaryTable {
  data: Array<DataDefaultSummaryTable>,
  error: DataError | null;
  status: DataStatus;
  set: (data: Array<DataDefaultSummaryTable>) => void;
  reset: () => void;
}

interface StoreDistrict {
  data: { label: string; value: string; }[],
  error: DataError | null;
  status: DataStatus;
  set: () => void;
  reset: () => void;
}
interface StoreDistrictKota {
  data: { label: string; value: string; latLng: LatLng }[],
  error: DataError | null;
  status: DataStatus;
  set: () => void;
  reset: () => void;
}

type OdpAreaMaping = Array<{ lat: number, lng: number }>

interface StorePolygon extends Polygon {
  setOptions: (arg0: { strokeColor?: string; zIndex: number; strokeOpacity?: number }) => void;
  kelurahan?: string;
  kecamatan?: string
  kode_desa_dagri?: string
}
