import dayjs from "dayjs";

import { Respondent } from "@api/survey-demand/respondent";
import { Vendor } from "@api/survey-demand/utility";

import { formatThousands, intersection } from "@functions/common";

import { Badge } from "@components/badge";

import { UserDataStore } from "../store/global";
import { FaCopy } from "react-icons/fa";
import ReactTooltip from 'react-tooltip';
import { tw } from "@functions/style";

export interface Param {
  status: string | object;
  roles: object;
  "lockedAdmin.lockedAt": object;
  "customdata.regional"?: object;
  "customdata.witel"?: object;
  "customdata.vendor"?: string;
}

interface Props {
  regional: string;
  witel: string;
  vendor: string;
  roleId: string;
}

export const getParam = ({ regional, witel, vendor, roleId }: Props) => {
  const param: Param = {
    status: "verified",
    roles: { $in: [roleId] },
    "lockedAdmin.lockedAt": { $in: [null, ""] },
  };

  if (regional) param["customdata.regional"] = { $regex: regional, $options: "i" };
  if (witel) param["customdata.witel"] = { $in: [witel] };
  if (vendor) param["customdata.vendor"] = vendor;

  return param;
};

export const generateInfoWindow = (params: { googleMaps: Maps; marker: Marker; markers: Marker[]; data: Respondent }) => {
  const { marker, markers, googleMaps, data } = params;

  const section = (label: string, value?: string | number) => {
    return `
        <div class="${"flex gap-5"}">
            <span class="${"w-[4.5rem]"}">${label}</span>
            <span>: <b class="${"font-bold"}">${value}</b></span>
        </div>`;
  };

  const content = `
        <div class="${"p-1 text-medium space-y-1 text-black-90"}">
            ${section("ID", data.id)}
            ${section("Surveyor", data.user?.fullname)}
            ${section("Nama", data.primary_answer)}
            ${section("Alamat", data.secondary_answer)}
            ${section("Status", data.status?.toUpperCase())}
            ${section("Kategori Demand", data.priority?.toUpperCase())}
            ${section("Tgl Survey", dayjs(data.survey_at).format("YYYY-MM-DD, HH:mm"))}
        </div>`;

  marker.set(
    "infoWindow",
    new window.google.maps.InfoWindow({
      content,
    })
  );

  marker.addListener("mouseover", () => {
    markers.forEach((marker) => marker.get("infoWindow").close());
    marker.get("infoWindow").open(googleMaps, marker);
  });

  marker.addListener("mouseout", () => {
    markers.forEach((marker) => marker.get("infoWindow").close());
  });
};

export const statusList = [
  { value: "", label: "Semua Status" },
  { value: "unvalidated", label: "Unvalidated" },
  { value: "invalid", label: "Invalid" },
  { value: "valid-mitra", label: "Valid Mitra" },
  { value: "valid", label: "Valid" },
];

export const categoryList = [
  { label: "Survey Microdemand", value: "1" },
  { label: "Survey Tracking Competitor (Pelanggan)", value: "6" },
  { label: "Survey Tracking Competitor (Jaringan)", value: "7" },
  { label: "Survey Evidance Capex", value: "9" },
  { label: "Survey UNSC", value: "10" },
];

export const areaList = [
  { label: "AREA 1", value: "AREA 1" },
  { label: "AREA 2", value: "AREA 2" },
  { label: "AREA 3", value: "AREA 3" },
  { label: "AREA 4", value: "AREA 4" },
];

export const regionalListFormat = (userDataStore: UserDataStore, regional: string[]) => {
  if (!userDataStore.role) return [];
  if (userDataStore.role === "admin-survey-mitra") {
    return [{ label: "Semua Region", value: "" }, ...regional.map((value) => ({ label: value, value }))];
  }

  if (userDataStore.regional && userDataStore.regional !== "National") {
    return [{ label: userDataStore.regional, value: userDataStore.regional }];
  } else {
    return [{ label: "Semua Region", value: "" }, ...regional.map((value) => ({ label: value, value }))];
  }
};

export const witelListFormat = (userDataStore: UserDataStore, witel: string[]) => {
  if (!userDataStore.role) return [];
  if (userDataStore.role === "admin-survey-mitra") {
    return [{ label: "Semua Branch", value: "" }, ...witel.map((value) => ({ label: value, value }))];
  }

  if (userDataStore.witel.length > 1) {
    return [{ label: "Semua Branch", value: "" }, ...userDataStore.witel.map((witel) => ({ label: witel, value: witel }))];
  } else if (userDataStore.witel.length && userDataStore.witel[0] !== "All") {
    return userDataStore.witel.map((witel) => ({ label: witel, value: witel }));
  } else {
    return [{ label: "Semua Branch", value: "" }, ...witel.map((value) => ({ label: value, value }))];
  }
};

export const vendorListFormat = (user: User, vendor: Vendor[]) => {
  if (intersection(user.role_keys, ["supervisor-survey-mitra", "admin-survey-mitra"]).length) {
    const selectedVendor = vendor.find((vendor) => vendor.surveyor === user.vendor);
    return [{ label: selectedVendor?.keterangan || user.vendor!, value: selectedVendor?.surveyor || user.vendor! }];
  } else {
    return [{ label: "Semua Vendor", value: "" }, ...vendor.map((vendor) => ({ label: vendor.keterangan, value: vendor.surveyor }))];
  }
};

export const tableDataDefault = ({ page, row, setData }: { page: number; row: number; setData: (data: Respondent) => void }) => {
  return [
    { header: "No", value: (_: unknown, index: number) => page * row - row + index + 1 },
    { header: "ID", value: (data: Respondent) => data.id },
    // { header: "Nama", value: (data: Respondent) => data.primary_answer },
    { header: "Surveyor", value: (data: Respondent) => data.user?.fullname },
    { header: "Polygon", value: (data: Respondent) => data.mysista_data?.name },
    { header: "Region", value: (data: Respondent) => data.treg, className: "whitespace-nowrap" },
    { header: "Branch", value: (data: Respondent) => data.witel },
    // { header: "Vendor", value: (data: Respondent) => data.sourcename },
    {
      header: "Status Survey",
      value: (data: Respondent) => {
        const variant = () => {
          switch (data.status) {
            case "valid":
              return "success";
            case "valid-mitra":
              return "warning";
            case "invalid":
              return "error";
            default:
              return "default";
          }
        };

        return <Badge variant={variant()}>{data.status?.toUpperCase()}</Badge>;
      },
    },
    {
      header: "Kategori Demand",
      value: (data: Respondent) => {
        const variant = () => {
          switch (data.priority) {
            case "high":
              return "success";
            case "medium":
              return "default";
            case "low":
              return "error";
            default:
              return "default";
          }
        };

        return <Badge variant={variant()}>{data.priority?.toUpperCase()}</Badge>;
      },
    },
    { header: "Waktu Survey", value: (data: Respondent) => dayjs(data.created_at).format("YYYY-MM-DD, HH:mm") },
    { header: "Waktu Valid", value: (data: Respondent) => dayjs(data.valid_at).format("YYYY-MM-DD, HH:mm") },
    // { header: "BAKP", value: (data: Respondent) => {
    //     if(data.mysista_data?.dokumen_bakp){
    //       return (
    //         <a className="text-blue-500 underline cursor-pointer" href={data.mysista_data?.dokumen_bakp} target="_blank">Lihat dokumen</a>
    //       )
    //     } else {
    //       return (
    //         <span>-</span>
    //       )
    //     }
    //   }
    // },
    {
      header: "Aksi",
      value: (data: Respondent) => (
        <span className="font-bold cursor-pointer text-primary-40" onClick={() => setData(data)}>
          Lihat
        </span>
      ),
    },
  ];
};

export const tableDataDefaultPerzinan = ({ page, row, setData }: { page: number; row: number; setData: (data: Respondent) => void }) => {
  return [
    { header: "No", value: (_: unknown, index: number) => page * row - row + index + 1 },
    { header: "ID", value: (data: Respondent) => data.id },
    { header: "Surveyor", value: (data: Respondent) => data.user?.fullname },
    { header: "Polygon", value: (data: Respondent) => data.mysista_data?.name, className: "whitespace-nowrap" },
    { header: "Regional", value: (data: Respondent) => data.telkom_treg, className: "whitespace-nowrap" },
    { header: "Witel", value: (data: Respondent) => data.telkom_witel },
    {
      header: "Status Permit",
      value: (data: Respondent) => {
        const variant = () => {
          switch (data.mysista_data?.status_permits) {
            case "approved":
              return "success";
            case "process":
              return "warning";
            case "rejected":
              return "error";
            default:
              return "default";
          }
        };

        if(!data.mysista_data?.status_permits){
          return "-";
        }

        return <Badge variant={variant()}>{data.mysista_data?.status_permits?.toUpperCase()}</Badge>;
      },
    },
    { header: "Waktu Survey", value: (data: Respondent) => dayjs(data.created_at).format("YYYY-MM-DD, HH:mm") },
    { header: "BAKP", value: (data: Respondent) => {
        if(data.mysista_data?.dokumen_bakp){
          return (
            <a className="text-blue-500 underline cursor-pointer" href={data.mysista_data?.dokumen_bakp} target="_blank">Lihat dokumen</a>
          )
        } else {
          return (
            <span>-</span>
          )
        }
      }
    },
    { header: "Biaya Perizinan", value: (data: Respondent) => formatThousands(data?.permits_fee) },
    {
      header: "Aksi",
      value: (data: Respondent) => (
        <span className="font-bold cursor-pointer text-primary-40" onClick={() => setData(data)}>
          Lihat
        </span>
      ),
    },
  ];
};

export const tableDataDefaultPreSurvey = ({ page, row, setData }: { page: number; row: number; setData: (data: Respondent) => void }) => {
  return [
    { header: "No", value: (_: unknown, index: number) => page * row - row + index + 1 },
    { header: "ID", value: (data: Respondent) => data.id },
    { header: "Surveyor", value: (data: Respondent) => data.user?.fullname },
    { header: "Polygon", value: (data: Respondent) => data.mysista_data?.name },
    { header: "Region", value: (data: Respondent) => data.treg, className: "whitespace-nowrap" },
    { header: "Branch", value: (data: Respondent) => data.witel },
    { header: "Vendor", value: (data: Respondent) => data.sourcename },
    {
      header: "Status Survey",
      value: (data: Respondent) => {
        const variant = () => {
          switch (data.status) {
            case "valid":
              return "success";
            case "valid-mitra":
              return "warning";
            case "invalid":
              return "error";
            default:
              return "default";
          }
        };

        return <Badge variant={variant()}>{data.status?.toUpperCase()}</Badge>;
      },
    },
    { header: "Waktu Survey", value: (data: Respondent) => dayjs(data.created_at).format("YYYY-MM-DD, HH:mm") },
    { header: "Waktu Valid", value: (data: Respondent) => dayjs(data.valid_at).format("YYYY-MM-DD, HH:mm") },
    {
      header: "Aksi",
      value: (data: Respondent) => (
        <span className="font-bold cursor-pointer text-primary-40" onClick={() => setData(data)}>
          Lihat
        </span>
      ),
    },
  ];
};

export const tableDataMobileDefault = ({ setData }: { setData: (data: Respondent) => void }) => {
  return [
    { header: "Nama", value: (data: Respondent) => data.name },
    { header: "Surveyor", value: (data: Respondent) => data.user?.fullname },
    { header: "Branch", value: (data: Respondent) => data.witel },
    { header: "Vendor", value: (data: Respondent) => data.sourcename },
    {
      header: "Status",
      value: (data: Respondent) => {
        const variant = () => {
          switch (data.status) {
            case "valid":
              return "success";
            case "valid-mitra":
              return "warning";
            case "invalid":
              return "error";
            default:
              return "default";
          }
        };

        return <Badge variant={variant()}>{data.status?.toUpperCase()}</Badge>;
      },
    },
    { header: "Waktu Survey", value: (data: Respondent) => dayjs(data.survey_at).format("YYYY-MM-DD, HH:mm") },
    {
      value: (data: Respondent) => (
        <label className="font-bold cursor-pointer text-primary-40" onClick={() => setData(data)}>
          Lihat Survey
        </label>
      ),
    },
  ];
};

export const getModalId = (id: string) => {
  switch (id) {
    case "9":
      return "dashboard-survey-evidance";
    case "10":
      return "dashboard-survey-unsc";
    default:
      return "dashboard-survey-default";
  }
};

const listVendorPolygon = [
  { label: "Semua Vendor", value: "" },
  { label: "Telkom Akses", value: "telkomakses" },
  { label: "Enciety", value: "enciety" },
];

export const getVendorPolygon = (vendor: string) => {
  return listVendorPolygon.find((item) => item.label === vendor)?.value || "";
}