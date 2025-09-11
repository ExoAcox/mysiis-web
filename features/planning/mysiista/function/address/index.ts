import { fetchKabupaten, fetchKecamatan, fetchKelurahan } from "../../queries/address";

export const handleSetAddress = (key: string, args: {
  provinsi?: string,
  kabupaten?: string,
  kecamatan?: string
}) => {
  switch (key) {
    case 'kabupaten':
      fetchKabupaten({ provinsi: args.provinsi! })
      break;
    case 'kecamatan':
      fetchKecamatan({ provinsi: args.provinsi!, kabupaten: args.kabupaten! })
      break;
    case 'kelurahan':
      fetchKelurahan({ provinsi: args.provinsi!, kabupaten: args.kabupaten!, kecamatan: args.kecamatan! })
      break;

    default:
      break;
  }
}