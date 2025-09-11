import { getSurveyorAssignmentTregWitel } from "@api/survey-demand/mysiista";

import { errorHelper } from "@functions/common";

import { useSurveyorStore } from "../../store/assignment";
import { useUserDataStore } from "../../store/global";

interface FetchSurveyorAssignment {
    row: number;
    page: number;
    supervisorid: string;
    userid?: string;
    mysistaid?: string;
}

export const fetchSurveyorAssignment = async (args: FetchSurveyorAssignment, isSamePage?: string) => {
    const userData = useUserDataStore.getState();

    useSurveyorStore.setState({ data: [], totalData: isSamePage ? useSurveyorStore.getState().totalData : 0, status: "pending", error: null });

    try {
        const surveyors = await getSurveyorAssignmentTregWitel({
            ...args,
            treg: userData.regional,
            witel: userData.witel,
            sourcename: userData.role === "admin-survey-branch" ? "telkomakses" : userData.vendor,
            surveyid: 1,
        });

        useSurveyorStore.setState({ data: surveyors.lists, totalData: surveyors.filteredCount, status: "resolve" });
    } catch (error) {
        useSurveyorStore.setState({ status: "reject", error: errorHelper(error) });
    }
};
