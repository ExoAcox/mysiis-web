import { useEffect, useMemo, useState } from "react";
import { When } from "react-if";
import dayjs from "dayjs";
import csvDownload from "json-to-csv-export";
import html2canvas from 'html2canvas';

import { getRegionTsel, getBranchTsel } from "@api/district/network";

import { useFilterSummaryStore, useSummaryStore } from "@features/planning/dashboard-microdemand/store/dashboard";
import { fetchSummaryDetail } from "@features/planning/dashboard-microdemand/queries/dashboard/survey";

import { Dropdown } from "@components/dropdown";
import useFetch from "@hooks/useFetch";
import { intersection } from "@functions/common";
import { exportSummaryActivity } from "@api/survey-demand/summary";
import { toast } from "react-toastify";

const areaList = [
    { value: "", label: "Semua Area" },
    { value: "AREA 1", label: "Area 1" },
    { value: "AREA 2", label: "Area 2" },
    { value: "AREA 3", label: "Area 3" },
    { value: "AREA 4", label: "Area 4" },
];

const vendorList = [
    { value: "", label: "Semua Vendor" },
    { value: "enciety", label: "Enciety" },
    { value: "telkomakses", label: "Telkom Akses" },
];

const exportList = [
    { value: "csv", label: "CSV" },
    { value: "image", label: "Image" },
    { value: "activity", label: "Activity" },
]

const FilterBar: React.FC<{ user: User }> = ({ user }) => {
    const filterStore = useFilterSummaryStore();
    const [isDownload, setIsDownload] = useState<boolean>(false);
    const [ data ] = useSummaryStore(store => [store.data]);
    const { area, region, branch, vendor } = filterStore;

    const regionStore = useFetch<string[]>([]);
    const branchStore = useFetch<string[]>([]);

    const regionList: Option<string>[] = useMemo(() => {
        return [
            { value: "", label: "Semua Region" },
            ...regionStore.data.map((value) => ({ label: value, value })),
        ];
    }, [regionStore]);

    const branchList: Option<string>[] = useMemo(() => {
        return [
            { value: "", label: "Semua Branch" },
            ...branchStore.data.map((value) => ({ label: value, value })),
        ];
    }, [branchStore]);

    useEffect(() => {
        if (area) {
            regionStore.fetch(getRegionTsel({ area }));
        } else {
            regionStore.setData([]);
        }
    }, [area]);

    useEffect(() => {
        if (region) {
            branchStore.fetch(getBranchTsel({ region: region }));
        } else {
            branchStore.setData([]);
        }
    }, [region]);

    const handleExportCsv = () => {
        const result = data.map((item) => {
            return {
                "Area": item.area,
                "Region": item.region,
                "Branch": item.branch,
                "Assignment (Cluster) Not Yet": item.assignment_polygon.not_yet,
                "Assignment (Cluster) Done": item.assignment_polygon.done,
                "Assignment (Cluster) Total": item.assignment_polygon.total,
                // "Izin Deployment (Cluster) Not Yet": item.permit_polygon.not_yet,
                // "Izin Deployment (Cluster) Yes": item.permit_polygon.yes,
                // "Izin Deployment (Cluster) Proses": item.permit_polygon.process,
                // "Izin Deployment (Cluster) No": item.permit_polygon.no,
                // "Izin Deployment (Cluster) Total": item.permit_polygon.total,
                "Progres Survey (Cluster) <50%": item.total_survey_polygon.low,
                "Progres Survey (Cluster) 50-75%": item.total_survey_polygon.medium,
                "Progres Survey (Cluster) 76-100%": item.total_survey_polygon.high,
                "Progres Survey (Cluster) Finish": item.total_survey_polygon.finish,
                "Progres Survey (Cluster) Design": item.total_survey_polygon.design,
                "Progres Survey (Cluster) Total": item.total_survey_polygon.total,
                "Hasil Survey Submit": item.total_survey.unvalidated,
                "Hasil Survey Valid Mitra": item.total_survey.valid_mitra,
                "Hasil Survey Valid": item.total_survey.valid,
                "Hasil Survey Invalid": item.total_survey.invalid,
                "Hasil Survey Total": item.total_survey.total,
                "Achievement (cluster assign) Target": item.achievement_assign.target_household,
                "Achievement (cluster assign) Progres": Math.round(item.achievement_assign.progress),
                "Achievement (all cluster) Target": item.achievement_all.target_household,
                "Achievement (all cluster) Progres": Math.round(item.achievement_all.progress),
            };
        });
        
        const dataToConvert = {
            data: result,
            filename: `Summary_${dayjs().format('YYYYMMDD_HHmmss')}.csv`,
            delimiter: ",",
        };
        setIsDownload(true);
        csvDownload(dataToConvert);
        setTimeout(() => {
            setIsDownload(false);
        }, 1000);
    };

    const HandleExportImage = () => {
        const table = document.getElementById('summary');
        setIsDownload(true);
        html2canvas(table!).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = imgData;
          link.download = `Summary_${dayjs().format('YYYYMMDD_HHmmss')}.png`;
          link.click();
        }).finally(() => {
            setIsDownload(false);
        });
    };

    const handleExportActivity = async () => {
        if(!user.permission_keys.includes("smd-tsel.survey.download-report-activity-surveyor")){
            toast.error("You don't have permission to export summary activity surveyor");
            return;
        }

        const filename = `Summary_activity_surveyor_${dayjs(new Date()).format("DDMMYYYY")}.xlsx`;
        try {
            setIsDownload(true);
            const result = await exportSummaryActivity(); 
            if(result){
                const blob = new Blob([result], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename + '.xlsx';
                document.body.appendChild(a);
                a.click();
                a.remove();
                window.URL.revokeObjectURL(url);
            } else {
                toast.error("Failed to export summary activity surveyor");
            }
        } finally {
            setIsDownload(false);
        }
    };

    return (
        <div className="flex justify-between items-end">
            <div className="w-full flex justify-start items-center gap-4">
                <Dropdown
                    id="filter-area"
                    label="Area"
                    placeholder="Pilih Area"
                    value={area}
                    options={areaList}
                    disabled={intersection(["admin-survey-area", "admin-survey-region", "admin-survey-branch", "supervisor-survey-mitra"], user.role_keys).length > 0}
                    onChange={(value) => {
                        filterStore.set({ area: value, region: "", branch: ""});
                        fetchSummaryDetail({ area: value, region: "", branch: "", vendor });
                    }}
                />
                <Dropdown
                    id="filter-region"
                    label="Region"
                    placeholder="Pilih Region"
                    value={region}
                    options={regionList}
                    loading={regionStore.status === "pending"}
                    error={regionStore.error}
                    disabled={!area || intersection(["admin-survey-region", "admin-survey-branch", "supervisor-survey-mitra"], user.role_keys).length > 0}
                    onChange={(value) => {
                        filterStore.set({ region: value, branch: "" });
                        fetchSummaryDetail({ area, region: value, branch: "", vendor });
                    }}
                />
                <Dropdown
                    id="filter-branch"
                    label="Branch"
                    placeholder="Pilih Branch"
                    value={branch}
                    options={branchList}
                    loading={branchStore.status === "pending"}
                    error={branchStore.error}
                    disabled={!region || intersection(["admin-survey-branch", "supervisor-survey-mitra"], user.role_keys).length > 0}
                    onChange={(value) => {
                        filterStore.set({ branch: value });
                        fetchSummaryDetail({ area, region, branch: value, vendor });
                    }}
                />
                <Dropdown
                    id="filter-vendor"
                    label="Vendor"
                    placeholder="Pilih Vendor"
                    value={vendor}
                    options={vendorList}
                    disabled={user.vendor !== "All"}
                    onChange={(value) => {
                        filterStore.set({ vendor: value ? value : "" });
                        fetchSummaryDetail({ area, region, branch, vendor: value ? value : "" });
                    }}
                />
            </div>
            <div className="h-full flex items-center justify-end gap-2">
                    <When condition={intersection(user.role_keys, ["admin-survey-nasional","admin-survey-area","admin-survey-region","admin-survey-branch"]).length}>
                        <Dropdown
                            id="export-summary"
                            placeholder="Unduh Laporan"
                            value={""}
                            options={exportList}
                            loading={isDownload}
                            disabled={isDownload}
                            onChange={(value) => {
                                if (value === "csv") {
                                    handleExportCsv();
                                } else if (value === "image") {
                                    HandleExportImage();
                                } else {
                                    handleExportActivity();
                                }
                            }}
                        />
                    </When>
            </div>
        </div>
    );
};

export default FilterBar;
