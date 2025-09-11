import { useEffect } from "react";
import { Unless, When } from "react-if";

import { User as User_, getListUser } from "@api/account/user";
import { SurveyorAssignment, getSurveyorAssignment } from "@api/survey-demand/mysiista";
import { getSupervisorAssignment } from "@api/survey-demand/supervisor";

import useFetch from "@hooks/useFetch";

import AssignmentIcon from "@images/bitmap/microdemand_assignment.png";
import PolygonIcon from "@images/bitmap/microdemand_polygon.png";
import SurveyIcon from "@images/bitmap/microdemand_survey.png";
import SurveyorIcon from "@images/bitmap/microdemand_surveyor.png";

import { roleOptions } from "@features/planning/dashboard-microdemand/functions/common";
import { Param, getParam } from "@features/planning/dashboard-microdemand/functions/dashboard";
import { useFilterStore, useSurveyStore } from "@features/planning/dashboard-microdemand/store/dashboard";
import { usePolygonStore, useUserDataStore, useUserStore } from "@features/planning/dashboard-microdemand/store/global";

import Card from "./components/Card";

const CardSection: React.FC<{ user: User }> = ({ user }) => {
    const userRole = useUserDataStore((store) => store.role);

    const surveyStore = useSurveyStore();
    const filterStore = useFilterStore();
    const { regional, witel, vendor, role } = filterStore;

    const surveyorStore = useUserStore();
    const polygonStore = usePolygonStore();

    const supervisorStore = useFetch<{ lists: User_[]; totalCount: number }>({ lists: [], totalCount: 0 });
    const surveyorAssignmentStore = useFetch<{ lists: SurveyorAssignment[]; filteredCount: number }>({ lists: [], filteredCount: 0 });
    const supervisorAssignmentStore = useFetch<{ lists: unknown[]; totalCount: number }>({ lists: [], totalCount: 0 });

    useEffect(() => {
        if (!userRole) return;
        if (userRole === "supervisor-survey-mitra") {
            surveyorAssignmentStore.fetch(getSurveyorAssignment({ row: 1, page: 1, supervisorid: user.userId }));
        } else {
            supervisorAssignmentStore.fetch(getSupervisorAssignment({ row: 1, page: 1 }));
        }
    }, [userRole]);

    useEffect(() => {
        if (!userRole) return;

        if (userRole.includes("admin")) {
            supervisorStore.fetch(
                getListUser<Param>({
                    row: 1,
                    page: 1,
                    regional,
                    witel,
                    vendor,
                    // role,
                    param: getParam({ regional, witel, vendor, roleId: roleOptions[1].value }),
                })
            );
        }
    }, [userRole, regional, witel, vendor]);

    return (
        <div>
            <When condition={userRole.includes("admin")}>
                <div className="grid grid-cols-5 gap-3 lg:grid-cols-2 sm:gap-2">
                    <Card label="Unvalidated" value={surveyStore.summary.unvalidated} loading={surveyStore.status === "pending"} />
                    <Card label="Valid Mitra" value={surveyStore.summary.valid_mitra} loading={surveyStore.status === "pending"} />
                    <Card label="Valid" value={surveyStore.summary.valid} loading={surveyStore.status === "pending"} />
                    <Card label="Invalid" value={surveyStore.summary.invalid} loading={surveyStore.status === "pending"} />
                    <Card label="Total" value={surveyStore.totalData} loading={surveyStore.status === "pending"} />
                </div>
            </When>
            <When condition={userRole.includes("supervisor")}>
                <div className="grid grid-cols-4 gap-3 lg:grid-cols-2 sm:gap-2">
                    <Card label="Surveyor" value={surveyorStore.totalData} icon={SurveyorIcon} loading={surveyorStore.status === "pending"} />
                    <Card label="Polygon" value={polygonStore.data.length} icon={PolygonIcon} loading={polygonStore.status === "pending"} />
                    <Card
                        label="Assignment"
                        value={surveyorAssignmentStore.data.filteredCount}
                        icon={AssignmentIcon}
                        loading={surveyorAssignmentStore.status === "pending"}
                    />
                    <Card label="Survey" value={surveyStore.totalData} icon={SurveyIcon} loading={surveyStore.status === "pending"} />
                </div>
            </When>
        </div>
    );
};

export default CardSection;
