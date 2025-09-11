import { errorHelper } from "@functions/common";
import { SummaryPermitsStoreDefault, useSummaryPermitsStore, useSurveyStore, FilterStore } from "../../store/dashboard";

import { getSummaryDashboardPemits } from "@api/survey-demand/summary";
import { useUserDataStore } from "../../store/global";
import { getRespondentPermitsByRegAndPolygon } from "@api/survey-demand/respondent";

export const fetchSummaryDashboardPemits = async (filter: {
    regional: string;
    witel?: string;
}) => {
    if(filter.regional === "") filter.regional = "ALL";
    if(filter.witel === "") delete filter.witel;

    useSummaryPermitsStore.setState({ data: [], status: "pending", error: null });
    try {
        const result = await getSummaryDashboardPemits(filter);
        const grandTotal = result.reduce((acc, curr) => {
            return {
                regional: acc.regional || curr.regional,
                witel: acc.witel || curr.witel,
                drop_pending: (acc?.drop_pending ?? 0) + (curr.drop_pending ?? 0),
                permits_approved: {
                    ogp_survey: acc.permits_approved.ogp_survey + curr.permits_approved.ogp_survey,
                    done: acc.permits_approved.done + curr.permits_approved.done,
                },
                permits_process: {
                    ogp_survey: acc.permits_process.ogp_survey + curr.permits_process.ogp_survey,
                    done: acc.permits_process.done + curr.permits_process.done,
                },
                permits_rejected: {
                    ogp_survey: acc.permits_rejected.ogp_survey + curr.permits_rejected.ogp_survey,
                    done: acc.permits_rejected.done + curr.permits_rejected.done,
                },
                permits_not_yet: {
                    ogp_survey: acc.permits_not_yet.ogp_survey + curr.permits_not_yet.ogp_survey,
                    done: acc.permits_not_yet.done + curr.permits_not_yet.done,
                },
                ihld_sent: {
                    done: acc.ihld_sent.done + curr.ihld_sent.done,
                }
            }
        }, { regional: "", witel: "", drop_pending: 0, permits_approved: { ogp_survey: 0, done: 0 }, permits_process: { ogp_survey: 0, done: 0 }, permits_rejected: { ogp_survey: 0, done: 0 }, permits_not_yet: { ogp_survey: 0, done: 0 }, ihld_sent: { done: 0 } });
        

        useSummaryPermitsStore.setState({ data: result, grandTotal: grandTotal, status: "resolve" });
    } catch (error) {
        useSummaryPermitsStore.setState({ status: "reject", data: [], grandTotal: SummaryPermitsStoreDefault, error: errorHelper(error) });
    }
};

export const fetchSurveyPermits = async (filter: FilterStore, isSamePage?: string) => {
    const { page, row, regional, witel, startDate, endDate, category, status_permits, search  } = filter;

    useSurveyStore.setState({ data: [], totalData: isSamePage ? useSurveyStore.getState().totalData : 0, status: "pending", error: null });
    const getWitel = () => {
        return witel ? [witel] : useUserDataStore.getState().telkom_witel.length ? useUserDataStore.getState().telkom_witel : "";
    };

    try {
        const surveys = await getRespondentPermitsByRegAndPolygon({
            row,
            page,
            survey_at_start: startDate,
            survey_at_end: endDate,
            telkom_treg: regional,
            telkom_witel: JSON.stringify(getWitel()),
            status_permits: status_permits,
            search: search,
            surveyid: category?.toString(),
            survey_by: JSON.stringify(["permits-ta"]),
        });

        const summary = {
            unvalidated: surveys.summary.unvalidated  ?? 0,
            valid_mitra: surveys.summary["valid-mitra"]  ?? 0,
            valid: surveys.summary.valid ?? 0,
            invalid: surveys.summary.invalid  ?? 0,
        
        };

        useSurveyStore.setState({ data: surveys.lists, totalData: surveys.filteredCount, summary: summary, status: "resolve" });
    } catch (error) {
        useSurveyStore.setState({ status: "reject", error: errorHelper(error) });
    }
};