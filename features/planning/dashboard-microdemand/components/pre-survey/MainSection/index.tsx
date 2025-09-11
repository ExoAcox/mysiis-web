import dynamic from "next/dynamic";
import { When } from "react-if";

import { Container } from "@features/planning/dashboard-microdemand/components/global";
import { filterDefaultValue, useFilterStore } from "@features/planning/dashboard-microdemand/store/dashboard";
import { useUserDataStore } from "@features/planning/dashboard-microdemand/store/global";

import { Button } from "@components/button";
import { Title } from "@components/text";

import { FilterBar, MainTable, ValidateModal } from "./components";

const SurveyModal = dynamic<{ user: User }>(() => import("./components").then((mod) => mod.SurveyModal));
const MapsModal = dynamic<object>(() => import("./components").then((mod) => mod.MapsModal));

const MainSection: React.FC<{ user: User; device: Device; refresh: () => void }> = ({ user, device, refresh }) => {
    const userDataStore = useUserDataStore();
    const filterStore = useFilterStore();

    const handleReset = () => {
        const defaultValue = {
            regional: userDataStore.regional,
            witel: userDataStore.witel.length === 1 ? userDataStore.witel[0] : "",
            vendor: userDataStore.vendor,
        };
        filterStore.set({ ...filterDefaultValue, ...defaultValue });
    };

    return (
        <Container className="flex flex-col gap-6 sm:gap-3 sm:shadow-none sm:p-3">
            <div className="flex items-center justify-between">
                <Title size="h2" mSize="h5" className="font-extrabold">
                    Daftar Survey Perizinan
                </Title>

                <When condition={device !== "mobile"}>
                    <Button variant="nude" className="sm:text-small" onClick={handleReset}>
                        Hapus Filter
                    </Button>
                </When>
            </div>
            <div className="flex flex-wrap gap-6 sm:flex-row sm:gap-3 sm:items-center">
                <FilterBar user={user} device={device} />

            </div>
            <MainTable device={device} />
            <SurveyModal user={user} />
            <MapsModal />
            <ValidateModal user={user} refresh={refresh} category={filterStore.category} />
        </Container>
    );
};

export default MainSection;
