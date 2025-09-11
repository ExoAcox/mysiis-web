import { useEffect, useMemo, useState } from "react";
import csvDownload from "json-to-csv-export";
import html2canvas from 'html2canvas';
import { getRegional, getWitel } from "@api/district/network";
import useFetch from "@hooks/useFetch";
import { regionalListFormat, witelListFormat } from "@features/planning/dashboard-permit/functions/common";
import { useFilterSummaryStore, useSummaryPermitsStore } from "@features/planning/dashboard-permit/store/dashboard";
import { useUserDataStore } from "@features/planning/dashboard-permit/store/global";
import { Dropdown } from "@components/dropdown";
import { fetchSummaryDashboardPemits } from "@features/planning/dashboard-permit/queries/dashboard/survey";
import dayjs from "dayjs";


const exportList = [
    { value: "image", label: "Image" },
    { value: "csv", label: "CSV" },
]

const FilterBar: React.FC<{ user: User }> = () => {
    const userDataStore = useUserDataStore();
    const filterStore = useFilterSummaryStore();
    const { regional, witel } = filterStore;
    const [ data ] = useSummaryPermitsStore(store => [store.data]); 
    const [isDownload, setIsDownload] = useState<boolean>(false);


    const regionalStore = useFetch<string[]>([]);
    const witelStore = useFetch<string[]>([]);

    const regionalList: Option<string>[] = useMemo(() => {
        return regionalListFormat(userDataStore, regionalStore.data);
    }, [regionalStore]);

    const witelList: Option<string>[] = useMemo(() => {
        return witelListFormat(userDataStore, witelStore.data);
    }, [witelStore]);

    useEffect(() => {
        if (regional) {
            witelStore.fetch(getWitel({ regional: regional }));
        } else {
            witelStore.setData([]);
        }
    }, [regional]);
 
    useEffect(() => {
        regionalStore.fetch(getRegional());
    }, []);

    const handleExportCsv = () => {
        const result = data.map((item) => {
            return {
                "Regional": item.regional,
                "Witel": item.witel,
                "drop_pending": item.drop_pending,
                "permit_not_yet(progress)": item.permits_not_yet.ogp_survey,
                "permit_not_yet(done)": item.permits_not_yet.done,
                "permit_not_yet(total)": item.permits_not_yet.ogp_survey + item.permits_not_yet.done,
                "permit_process(progress)": item.permits_process.ogp_survey,
                "permit_process(done)": item.permits_process.done,
                "permit_process(total)": item.permits_process.ogp_survey + item.permits_process.done,
                "permit_rejected(progress)": item.permits_rejected.ogp_survey,
                "permit_rejected(done)": item.permits_rejected.done,
                "permit_rejected(total)": item.permits_rejected.ogp_survey + item.permits_rejected.done,
                "permit_approved(progress)": item.permits_approved.ogp_survey,
                "permit_approved(done)": item.permits_approved.done,
                "permit_approved(total)": item.permits_approved.ogp_survey + item.permits_approved.done,
                "done": item.ihld_sent.done,
            };
        });
        
        const dataToConvert = {
            data: result,
            filename: `Summary_permit_${dayjs().format('YYYYMMDD_HHmmss')}.csv`,
            delimiter: ",",
        };
        setIsDownload(true);
        csvDownload(dataToConvert);
        setTimeout(() => {
            setIsDownload(false);
        }, 1000);
    };

    const HandleExportImage = () => {
        const table = document.getElementById('summary-permit');
        setIsDownload(true);
        html2canvas(table!).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const link = document.createElement('a');
          link.href = imgData;
          link.download = `Summary_permit_${dayjs().format('YYYYMMDD_HHmmss')}.png`;
          link.click();
        }).finally(() => {
            setIsDownload(false);
        });
    };

    return (
        <div className="flex justify-between items-end">
            <div className="w-full flex justify-start items-center gap-4">
                <Dropdown
                    id="filter-regional"
                    label="Regional"
                    placeholder="Pilih Regional"
                    value={regional}
                    options={regionalList}
                    disabled={["supervisor-survey-mitra", "admin-survey-branch", "admin-survey-region"].includes(userDataStore.role)}
                    error={regionalStore.error}
                    onChange={(value) => {
                        filterStore.set({ regional: value, witel: "" });
                        fetchSummaryDashboardPemits({ regional: value! });
                    }}
                />
                <Dropdown
                    id="filter-witel"
                    label="Witel"
                    placeholder="Pilih Witel"
                    value={witel}
                    options={witelList}
                    disabled={["supervisor-survey-mitra", "admin-survey-branch"].includes(userDataStore.role) || !regional }
                    error={witelStore.error}
                    onChange={(value) => {
                        filterStore.set({ witel: value });
                        fetchSummaryDashboardPemits({ regional: regional!, witel: value ? JSON.stringify([value!]) : "" });
                    }}
                />
            </div>
            <div className="h-full flex items-center justify-end gap-2">
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
                        }
                    }}
                />
            </div>
        </div>
    );
};

export default FilterBar;
