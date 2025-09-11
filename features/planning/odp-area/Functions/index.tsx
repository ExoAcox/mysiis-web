import { SummaryPenetration } from "@api/district/summary";
import { googleMapsDistrictOdp, odpAreaMarkersDistrictOdp } from "@pages/planning/odp-area/district-odp";
import dayjs from "dayjs";

export const tabOptionsOdpArea = [
  { label: "ODP Summary", value: "odp-summary" },
  { label: "District ODP", value: "district-odp" },
  { label: "District Summary", value: "district-summary" },
];

export const viewMapsOdpArea = (name: string) => {
  const marker = odpAreaMarkersDistrictOdp.find((marker) => marker.get("name") === name);
  if (!marker) return;

  googleMapsDistrictOdp.panTo(marker.getPosition()!);
  if (googleMapsDistrictOdp.getZoom()! < 18) googleMapsDistrictOdp.setZoom(18);

  marker.get("infoWindow").open(googleMapsDistrictOdp, marker);
};

export const sortingOption = [
  { label: "Berdasarkan Kecamatan", value: "kecamatan" },
  { label: "Berdasarkan Kelurahan", value: "kelurahan" },
  { label: "Berdasarkan Building", value: "building" },
  { label: "Berdasarkan ODP Count", value: "odp" },
  { label: "Berdasarkan Device Port", value: "deviceport" },
  { label: "Berdasarkan Used Port", value: "usedport" },
  { label: "Berdasarkan Idle Port", value: "portidle" },
  { label: "Berdasarkan Port Penetration", value: "penetration" },
  { label: "Berdasarkan Port Readiness", value: "readiness" },
];

export const formatDataList = (data_sort: SummaryPenetration[]) => {
  const data_format = data_sort.map(data => {
    const penetration = data.building_count
      ? parseFloat((((data.odp_deviceportnumber - data.odp_portidlenumber) / data.building_count) * 100).toFixed(2))
      : 0.0;
    return ({
      "last_updated_at": `${dayjs(data.last_updated_at).format('YYYY-MM-DD')}`,
      "port_penetration": `${penetration}%`,
      "port_readiness": data.penetrasi_percent ? `${data.penetrasi_percent.toFixed(2)}%` : "0%",
      "kecamatan": data.kecamatan,
      "kelurahan": data.kelurahan,
      "building": String(data.building_count),
      "odp_count": String(data.odp_count),
      "device_port": String(data.odp_deviceportnumber),
      "used_port": String(data.odp_deviceportnumber - data.odp_portidlenumber),
      "idle_port": String(data.odp_portidlenumber),
    })
  })
  return data_format
}