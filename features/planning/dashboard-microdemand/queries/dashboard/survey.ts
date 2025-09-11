import { useQuery } from "@tanstack/react-query";

import { getConfiguration } from "@api/survey-demand/configuration";
import { getRespondentByRegAndPolygon, getRespondentPermitsByRegAndPolygon } from "@api/survey-demand/respondent";

import { errorHelper } from "@functions/common";

import { FilterStore, SummaryDefaultValue, useSummaryStore, useSurveyStore } from "../../store/dashboard";
import { FilterStore as FilterPermitStore } from "@features/planning/dashboard-permit/store/dashboard";
import { useUserDataStore } from "../../store/global";
import { getSummaryDetail } from "@api/survey-demand/summary";

export const fetchSurvey = async (filter: FilterStore, isSamePage?: string) => {
    const { page, row, search, regional, witel, status, vendor, startDate, endDate, category, surveyor, polygon, searchType } = filter;

    useSurveyStore.setState({ data: [], totalData: isSamePage ? useSurveyStore.getState().totalData : 0, status: "pending", error: null });
    const getWitel = () => {
        return witel ? [witel] : useUserDataStore.getState().witel.length ? useUserDataStore.getState().witel : "";
    };

    try {
        const surveys = await getRespondentByRegAndPolygon({
            row,
            page,
            survey_at_start: startDate,
            survey_at_end: endDate,
            name: searchType === "name" ? search : undefined,
            phone: searchType === "phone" ? search : undefined,
            treg: regional,
            witel: getWitel(),
            userid: surveyor ? [surveyor] : undefined,
            mysistaid: polygon ? Number(polygon) : undefined,
            status,
            surveyid: category,
            sourcename: vendor,
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

export const fetchSurveyPermits = async (filter: FilterPermitStore, isSamePage?: string) => {
    const { page, row, regional, witel, startDate, endDate, category, status_permits, search  } = filter;

    useSurveyStore.setState({ data: [], totalData: isSamePage ? useSurveyStore.getState().totalData : 0, status: "pending", error: null });
    const getWitel = () => {
        return witel ? [witel] : useUserDataStore.getState().witel.length ? useUserDataStore.getState().witel : "";
    };

    try {
        const surveys = await getRespondentPermitsByRegAndPolygon({
            row,
            page,
            survey_at_start: startDate,
            survey_at_end: endDate,
            treg: regional,
            witel: JSON.stringify(getWitel()),
            status_permits: status_permits,
            search: search,
            surveyid: category?.toString(),
            survey_by: JSON.stringify(["permits-ta","pre-survey-ta"]),
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

export const fetchSummaryDetail = async (filter: {
    area: string;
    region?: string;
    branch?: string;
    vendor?: string;
}) => {
    if(filter.area === "") filter.area = "ALL";
    if(filter.region === "") delete filter.region;
    if(filter.branch === "") delete filter.branch;
    if(filter.vendor === "") delete filter.vendor;

    useSummaryStore.setState({ data: [], status: "pending", error: null });
    try {
        const result = await getSummaryDetail(filter);
        const grandTotal = result.reduce((acc, curr) => {
            return {
                area: "",
                region: "",
                branch: "",
                assignment_polygon: {
                    done: acc.assignment_polygon.done + curr.assignment_polygon.done,
                    not_yet: acc.assignment_polygon.not_yet + curr.assignment_polygon.not_yet,
                    total: acc.assignment_polygon.total + curr.assignment_polygon.total,
                },
                permit_polygon: {
                    not_yet: acc.permit_polygon.not_yet + curr.permit_polygon.not_yet,
                    yes: acc.permit_polygon.yes + curr.permit_polygon.yes,
                    process: acc.permit_polygon.process + curr.permit_polygon.process,
                    no: acc.permit_polygon.no + curr.permit_polygon.no,
                    total: acc.permit_polygon.total + curr.permit_polygon.total,
                },
                total_survey_polygon: {
                    low: acc.total_survey_polygon.low + curr.total_survey_polygon.low,
                    medium: acc.total_survey_polygon.medium + curr.total_survey_polygon.medium,
                    high: acc.total_survey_polygon.high + curr.total_survey_polygon.high,
                    finish: acc.total_survey_polygon.finish + curr.total_survey_polygon.finish,
                    pending: acc.total_survey_polygon.pending + curr.total_survey_polygon.pending,
                    design: acc.total_survey_polygon.design + curr.total_survey_polygon.design,
                    drop: acc.total_survey_polygon.drop + curr.total_survey_polygon.drop,
                    total: acc.total_survey_polygon.total + curr.total_survey_polygon.total,
                },
                total_survey: {
                    unvalidated: acc.total_survey.unvalidated + curr.total_survey.unvalidated,
                    valid_mitra: acc.total_survey.valid_mitra + curr.total_survey.valid_mitra,
                    valid: acc.total_survey.valid + curr.total_survey.valid,
                    invalid: acc.total_survey.invalid + curr.total_survey.invalid,
                    total: acc.total_survey.total + curr.total_survey.total,
                },
                total_polygon_permits: {
                    waiting: acc.total_polygon_permits.waiting + curr.total_polygon_permits.waiting,
                },
                achievement_assign: {
                    target_household: acc.achievement_assign.target_household + curr.achievement_assign.target_household,
                    progress: (acc.total_survey.total + curr.total_survey.total) / (acc.achievement_assign.target_household + curr.achievement_assign.target_household) * 100,
                },
                achievement_all: {
                    target_household: acc.achievement_all.target_household + curr.achievement_all.target_household,
                    progress: (acc.total_survey.total + curr.total_survey.total) / (acc.achievement_all.target_household + curr.achievement_all.target_household) * 100,
                },
            };
        });
        

        useSummaryStore.setState({ data: result, grandTotal: grandTotal, status: "resolve" });
    } catch (error) {
        useSummaryStore.setState({ status: "reject", data: [], grandTotal: SummaryDefaultValue, error: errorHelper(error) });
    }
};

export const useConfig = (configurationId: number) => {
    return useQuery({
        queryKey: ["/survey-demand/configuration/getConfiguration", configurationId],
        queryFn: () => getConfiguration(configurationId),
    });
};
