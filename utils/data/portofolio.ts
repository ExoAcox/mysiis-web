import DashboardMicrodemandIcon from "@images/portofolio-icon/dashboard-microdemand.svg";
import DataDemandIcon from "@images/portofolio-icon/data-demand.svg";
import DistrictValidationIcon from "@images/portofolio-icon/district-validation.svg";
import IpcaIcon from "@images/portofolio-icon/ipca.svg";
import MysiistaIcon from "@images/portofolio-icon/mysiista.svg";
import OdpAreaIcon from "@images/portofolio-icon/odp-area.svg";
import OdpViewIcon from "@images/portofolio-icon/odp-view.svg";
import RpaPoolingIcon from "@images/portofolio-icon/rpa-pooling.svg";
import SpeedtestOoklaIcon from "@images/portofolio-icon/speedtest-ookla.svg";

// import SupervisorMenuIcon from "@images/portofolio-icon/supervisor-menu.svg";

export const allowedPermissions = [
    "odp-general",
    "district-data",
    "data-demand",
    "mysiis.district-validation",
    "surveydemand-web",
    "dashboard-poi",
    "demand-potential-poi-web",
    "development",
    "smd-tsel.survey.download-report-activity-surveyor",
    "smd-tsel.survey.download-report-activity-surveyor",
    "web-dashboard-survey-permit-deployment.view",
    "smd-tsel.survey.download-respondent"
];

const data: Portofolio[] = [
    {
        category: "fulfillment",
        path: "/fulfillment/odp-view",
        label: "ODP View",
        icon: OdpViewIcon,
        permission: ["development", "odp-general"],
        description: "Menampilkan data ODP UIM atau Valins pada lokasi yang dipilih",
        guest: true,
    },
    {
        category: "planning",
        path: "/planning/odp-area",
        label: "ODP Area",
        icon: OdpAreaIcon,
        permission: ["development", "district-data"],
        description: "Menampilkan data ODP di lokasi tertentu berdasarkan Regional, Witel, STO, ODC",
    },
    {
        category: "planning",
        path: "/planning/data-demand",
        label: "Data Demand",
        icon: DataDemandIcon,
        permission: ["development", "data-demand"],
        description: "Data statistik hasil microdemand, witel, dan potensi pelanggan yang ingin menggunakan IndiHome",
    },
    {
        category: "planning",
        path: "/planning/district-validation",
        label: "District Validation",
        icon: DistrictValidationIcon,
        permission: ["development", "mysiis.district-validation"],
        description: "Perbandingan Data District & Street pada SIIS - NCX untuk kebutuhan update Data NCX",
    },
    {
        category: "planning",
        path: "/planning/dashboard-microdemand",
        label: "Dashboard Microdemand",
        longLabel: true,
        icon: DashboardMicrodemandIcon,
        permission: ["surveydemand-web"],
        description: "Dashboard operasional survey microdemand",
    },
    {
        category: "planning",
        path: "/planning/dashboard-permit",
        label: "Dashboard Permit",
        longLabel: true,
        icon: DashboardMicrodemandIcon,
        permission: ["web-dashboard-survey-permit-deployment.view"],
        description: "Dashboard operasional survey permit deployment",
    },
    // {
    //     category: "planning",
    //     path: "/planning/dashboard-poi",
    //     label: "Dashboard Point of Interest",
    //     longLabel: true,
    //     icon: DashboardMicrodemandIcon,
    //     permission: ["development", "dashboard-poi"],
    //     description: "Menampilkan data validasi Point of Interest",
    // },
    // {
    //     category: "planning",
    //     path: "/planning/demand-potential-poi",
    //     label: "Demand Potential Point of Interest",
    //     longLabel: true,
    //     icon: DataDemandIcon,
    //     permission: ["development", "demand-potential-poi-web"],
    //     description: "Menampilkan data Demand Potential Point of Interest dengan visualisasi peta",
    // },
    {
        category: "planning",
        path: "/planning/speedtest-ookla",
        label: "Speedtest Ookla",
        icon: SpeedtestOoklaIcon,
        permission: ["development"],
        description: "Menampilkan data hasil speedtest Ookla berdasarkan radius dan kelurahan",
    },
    {
        category: "planning",
        path: "/planning/mysiista",
        label: "MySiista",
        icon: MysiistaIcon,
        permission: ["development"],
        description: "Data Polygon Drawing & menambahkan gambar polygon baru",
    },
    {
        category: "planning",
        path: "/planning/ipca",
        label: "IPCA",
        icon: IpcaIcon,
        permission: ["development"],
        description: "Menampilkan data IPCA (Intergrasi Premium Cluster & Apartment)",
    },
    // {
    //     category: "support",
    //     path: "/support/supervisor-menu",
    //     label: "Supervisor Menu",
    //     icon: SupervisorMenuIcon,
    //     permission: ["development","supervisor"],
    //     description: "Menu untuk melakukan approve atau block kepada bawahan sesuai role dan area masing-masing",
    // },
    {
        category: "support",
        path: "/support/word-transform",
        label: "Word Transform",
        icon: RpaPoolingIcon,
        permission: ["development"],
        description: "Merubah kata menjadi sesuatu yang lainnya",
    },
];

export default data;
