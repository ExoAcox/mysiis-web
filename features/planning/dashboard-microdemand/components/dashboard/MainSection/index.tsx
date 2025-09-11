import dynamic from "next/dynamic";
import { useState } from "react";
import { When } from "react-if";

import { Container } from "@features/planning/dashboard-microdemand/components/global";
import { filterDefaultValue, useFilterStore } from "@features/planning/dashboard-microdemand/store/dashboard";
import { useUserDataStore } from "@features/planning/dashboard-microdemand/store/global";

import { Button } from "@components/button";
import { Title } from "@components/text";

import { FilterBar, MainTable, RejectModal, SearchBar, ValidateModal } from "./components";
import dayjs from "dayjs";
import { exportListRespondent, paramsExportListRespondent } from "@api/survey-demand/respondent";
import { toast } from "react-toastify";
import { getSupervisor } from "@api/survey-demand/supervisor";

const SurveyModal = dynamic<{ user: User }>(() => import("./components").then((mod) => mod.SurveyModal));
const MapsModal = dynamic<object>(() => import("./components").then((mod) => mod.MapsModal));

const MainSection: React.FC<{ user: User; device: Device; refresh: () => void }> = ({ user, device, refresh }) => {
    const userDataStore = useUserDataStore();
    const filterStore = useFilterStore();
    const [isDownload, setIsDownload] = useState(false);

    const handleReset = () => {
        const defaultValue = {
            regional: userDataStore.regional,
            witel: userDataStore.witel.length === 1 ? userDataStore.witel[0] : "",
            vendor: userDataStore.vendor,
        };
        filterStore.set({ ...filterDefaultValue, ...defaultValue });
    };

    const handleDownload = async () => {
        const filename = `respondent_${dayjs(new Date()).format("DDMMYYYY")}.xlsx`;
        try {
            const { regional, witel, vendor, startDate, endDate } = filterStore;
            
            setIsDownload(true);
            const params: paramsExportListRespondent = {
                area: user.tsel_area,
                region: regional,
                branch: JSON.stringify([witel]),
                vendor: vendor,
                valid_at_start: startDate,
                valid_at_end: endDate,
            };

            if(userDataStore.role === "supervisor-survey-mitra"){
                getSupervisor(user.userId).then((res) => {
                    if(res){
                        params.region = res.mysista_treg;
                        params.branch = JSON.stringify(res.mysista_witel);
                    }
                });
            }

            if(!user.vendor || user.vendor === "All"){
                delete params.vendor;
            }

            const result = await exportListRespondent(params); 

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
        <Container className="flex flex-col gap-6 sm:gap-3 sm:shadow-none sm:p-3">
            <div className="flex items-center justify-between">
                <Title size="h2" mSize="h5" className="font-extrabold">
                    Daftar Survey
                </Title>

                <When condition={device !== "mobile"}>
                    <Button variant="nude" className="sm:text-small" onClick={handleReset}>
                        Hapus Filter
                    </Button>
                </When>
            </div>
            <div className="flex flex-wrap items-end gap-6 sm:flex-row sm:gap-3 sm:items-center">
                <FilterBar user={user} device={device} />
                <When condition={user.permission_keys.includes("smd-tsel.survey.download-respondent")}>
                    <Button className="h-12" variant="filled" onClick={handleDownload} loading={isDownload} disabled={isDownload}>
                        Download Data
                    </Button>
                </When>
                {/* <When condition={device !== "mobile"}>
                    <SearchBar />
                </When> */}
            </div>
            <MainTable device={device} />
            <SurveyModal user={user} />
            <MapsModal />
            <ValidateModal user={user} refresh={refresh} category={filterStore.category} />
            <RejectModal refresh={refresh} category={filterStore.category} />
        </Container>
    );
};

export default MainSection;
