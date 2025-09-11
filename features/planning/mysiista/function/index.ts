import { FormattedOdp } from "@functions/odp";


export const getOdpPercent = (odps: FormattedOdp[]) => {
  const devicePort = odps.map((odp) => odp.devicePort).reduce((acc, data) => acc + data);
  const idlePort = odps.map((odp) => odp.idlePort).reduce((acc, data) => acc + data);
  return parseFloat(((idlePort / devicePort) * 100).toFixed(1));
};

export const infoWindowContentOdp = (odp: FormattedOdp, distance?: number) => {
  const section = (label: string, value: string | number) => {
    return `
        <div class="${"flex gap-5"}">
            <span class="${"w-[5.25rem]"}">${label}</span>
            <span>: <b class="${"font-bold"}">${value}</b></span>
        </div>`;
  };

  const content = `
        <div class="${"p-1 text-medium space-y-1 text-black-90"}">
            ${section("Device ID", odp.deviceId)}
            ${section("Device Name", odp.name)}
            ${section("Status", odp.status)}
            ${section("Device Port", odp.devicePort)}
            ${section("Idle Port", odp.idlePort)}
            ${section("Updated Date", odp.date)}
            ${distance ? section("Distance", distance + "m") : ""}
        </div>`;

  return content;
};

import IconPrioritas1 from '@public/images/vector/icon-prioritas-1.svg';
import IconPrioritas2 from '@public/images/vector/icon-prioritas-2.svg';
import IconPrioritas3 from '@public/images/vector/icon-prioritas-3.svg';
import Drop from '@public/images/vector/icon-drop.svg';
import { InValid, UnValidated, Valid, ValidMitra } from "./icon_marker";
import React from "react";

interface MenuTemplate {
  label: string,
  icon: React.ElementType,
  color: string,
  value: 'prioritas-1' | 'prioritas-2' | 'prioritas-3' | 'drop',
  priority: number
}

export const menuTemplate: MenuTemplate[] = [
  {
    label: 'Prioritas 1',
    icon: IconPrioritas1,
    color: '#D12030',
    value: 'prioritas-1',
    priority: 1
  },
  {
    label: 'Prioritas 2',
    icon: IconPrioritas2,
    color: '#FF8B00',
    value: 'prioritas-2',
    priority: 2
  },
  {
    label: 'Prioritas 3',
    icon: IconPrioritas3,
    color: '#36B37E',
    value: 'prioritas-3',
    priority: 3
  },
  {
    label: 'Drop',
    icon: Drop,
    color: '#262829',
    value: 'drop',
    priority: 0
  },
]

export const optionDrawing = {
  editable: true,
  draggable: true,
  strokeWeight: 5,
  fillOpacity: 0.5,
  fillColor: "#D12030",
  strokeColor: "#D12030",
};

interface InfoWindowContentUser {
  address: string,
  belanja_online: string,
  berita: string,
  communication_expenses: string,
  created_at: string,
  gaming: string
  hiburan: string
  id: number
  invalid_reason: null | string
  kebutuhan_inet_bekerja: string,
  kebutuhan_sekolah: string,
  kepemilikan_rumah: string,
  latitude: number,
  longitude: number,
  media_sosial: string,
  mysiista_updated: string,
  nama_respondent: string,
  pekerjaan: string,
  phone: string,
  photo: string
  pln_id: string,
  pln_kwh: string,
  providers: string
  scale_of_need: string,
  source: string
  status: string,
  subscriber_plans: string,
  surveyor_id: number
  surveyor_treg: string
  surveyor_witel: string
  tahap_survey: string
  valid_at: string
}

export const infoWindowContentUser = (user: InfoWindowContentUser) => {
  const section = (label: string, value: string | number) => {
    return `
        <div class="${"flex gap-5"}">
            <span class="${"w-[5.25rem]"}">${label}</span>
            <span>: <b class="${"font-bold"}">${value}</b></span>
        </div>`;
  };

  const content = `
        <div class="${"p-1 text-medium space-y-1 text-black-90"}">
            ${section("Device ID", user.id)}
            ${section("Name", user.nama_respondent)}
            ${section("Phone", user.phone)}
            ${section("Address", user.address)}
            ${section("Status", user.status)}
          </div>
        </div>`;

  return content;
};


export const checkStatus = (status: string) => {

  let icon;
  switch (status) {
    case 'valid':
      icon = Valid;
      break;
    case 'valid-mitra':
      icon = ValidMitra;
      break;
    case 'invalid':
      icon = InValid;
      break;
    default:
      icon = UnValidated;
      break;
  }

  return {
    anchor: new window.google.maps.Point(10, 10),
    url: 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(icon),
  };
}