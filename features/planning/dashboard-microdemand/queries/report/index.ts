import { getBranchTsel } from "@api/district/network";
import { activateAssignmentByPolygon } from "@api/survey-demand/mysiista";
import { GetSurveyCountWitel, getSurveyCount, getSurveyCountWitel } from "@api/survey-demand/respondent";
import { getSupervisor } from "@api/survey-demand/supervisor";
import { getSurveyCategory } from "@api/survey-demand/survey";

import { errorHelper } from "@functions/common";

import { FiltersProps } from "../../components/report/Filters";
import { ParamsStateMainContentReport } from "../../components/report/MainContent";
import { capitalize, roleAccess, validationUserRole } from "../../functions/report";
import { useSurveyCategorylStore, useSurveyCountStore, useSurveyCountWitelStore, useWitelStore } from "../../store/report";

const fetcDataSummary = async (user: User, params: ParamsStateMainContentReport, source: string, reset: () => void) => {
    const { regional, witel, survey_at_start, survey_at_end, sourcename, surveyCategory, supervisor, page, row, statusPolygon } = params;
    const check = validationUserRole(user.role_keys, roleAccess);

    if (check) {
        reset();

        let regionalProfil, witelProfil, vendorProfil: string | undefined;
        if (validationUserRole(user.role_keys, ["admin-survey-region", "nik_admin-survey-region"])) {
            regionalProfil = user.tsel_region ? user.tsel_region : "";
            witelProfil = [];
            vendorProfil = "";
        }
        if (validationUserRole(user.role_keys, ["admin-survey-branch", "nik_admin-survey-branch"])) {
            regionalProfil = user.tsel_region ? user.tsel_region : "";
            witelProfil = [user?.tsel_branch];
            vendorProfil = "";
        }
        if (validationUserRole(user.role_keys, ["admin-survey-mitra"])) {
            regionalProfil = "";
            witelProfil = [];
            vendorProfil = user.vendor ? user.vendor : "";
        }

        try {
            if (validationUserRole(user.role_keys, ["supervisor-survey-mitra"])) {
                const supervisors = await getSupervisor(user.userId);
                if (supervisors?.mysista_treg) {
                    regionalProfil = supervisors.mysista_treg;
                    witelProfil = supervisors.mysista_witel;
                    vendorProfil = supervisors.mysista_source;
                } else {
                    regionalProfil = "-";
                    witelProfil = "-";
                    vendorProfil = "-";
                }
            }
            useSurveyCountStore.setState({ status: "pending", data: [] });

            const dataSurveyCount = await getSurveyCount({
                treg: regional.length > 0 ? regional.toUpperCase() : regionalProfil ? regionalProfil.toUpperCase() : "",
                witel: witel.length > 0 ? JSON.stringify(witel) : JSON.stringify(witelProfil),
                supervisorid: supervisor ? JSON.stringify(user.userId) : "",
                sourcename: sourcename.length > 0 ? sourcename : vendorProfil ? vendorProfil : "",
                surveyid: String(surveyCategory),
                survey_at_start,
                survey_at_end,
                status: source,
                status_polygon: statusPolygon,
                page,
                row,
            });
            
            const newdataSurveyCount = dataSurveyCount.map((item) => {
                return {
                    userId: item.user?.userId,
                    name: source == "surveyor" ? item.user.fullname : item?.polygon?.name,
                    witel: source === "surveyor" ? item.witel : item?.polygon?.witel,
                    mitra: source === "surveyor" ? item.user?.customdata?.vendor : item?.polygon?.surveyor,
                    valid: item.respondent.valid,
                    validMitra: item.respondent.valid_mitra,
                    invalid: item.respondent.invalid,
                    unvalidated: item.respondent.unvalidated,
                    target: item.polygon?.target_household || 0,
                    objectid: item.polygon?.objectid || 0,
                    supervisor_name: item.supervisor?.fullname || "",
                    dokumen_bakp: item.polygon?.dokumen_bakp || "",
                    total:
                        Number(item.respondent.valid) +
                        Number(item.respondent.valid_mitra) +
                        Number(item.respondent.invalid) +
                        Number(item.respondent.unvalidated),
                    status: item.polygon?.status || "-",
                    progress:
                        (item?.polygon?.target_household &&
                            ((Number(item.respondent.valid) +
                                Number(item.respondent.valid_mitra) +
                                Number(item.respondent.invalid) +
                                Number(item.respondent.unvalidated)) *
                                100) /
                                item?.polygon?.target_household) ||
                        0,
                };
            });
            useSurveyCountStore.setState({ data: newdataSurveyCount, status: "resolve" });
        } catch (error) {
            useSurveyCountStore.setState({ status: "reject", error: errorHelper(error) });
        }
    }
};

export const handleWitel = async (regional: string) => {
    if (regional) {
        try {
            const result = await getBranchTsel({ region: regional });
            const newWitels: Option<string>[] = [];
            result.forEach((item: string) => {
                newWitels.push({ label: item, value: item });
            });
            if (newWitels.length > 0) useWitelStore.setState({ data: [ { label: "Semua Branch", value: "" }, ...newWitels ] });
        } catch (error) {
            errorHelper(error);
        }
    }
};

const fetchDataWitel = async ({ params, setParams, user }: FiltersProps) => {
    try {
        if (validationUserRole(user?.role_keys, ["admin-survey-region", "nik_admin-survey-region"])) {
            user.tsel_region && handleWitel(user.tsel_region);
        } else if (validationUserRole(user?.role_keys, ["admin-survey-branch", "nik_admin-survey-branch"])) {
            useWitelStore.setState({ data: [{ label: user.tsel_branch || "", value: user.tsel_branch || "" }] });
            user.tsel_branch && setParams({ ...params, witel: [user.tsel_branch] });
        } else {
            const supervisors = await getSupervisor(user.userId);
            if (supervisors?.mysista_treg) {
                if(supervisors.mysista_witel.length > 0){
                    const witels = supervisors.mysista_witel.map((e) => ({ label: e, value: e }));
                    useWitelStore.setState({ data: [{ label: "Semua branch", value:"" }, ...witels ]  });
                } 
                // setParams({ ...params, witel: supervisors.mysista_witel });
            }
        }
    } catch (error) {
        errorHelper(error);
    }
};

const fetchSurveyCategory = async () => {
    try {
        const dataSurveyCategory = await getSurveyCategory();
        useSurveyCategorylStore.setState({ data: dataSurveyCategory.lists.map((e) => ({ label: e.name, value: String(e.id) })) });
    } catch (error) {
        errorHelper(error);
    }
};

const fetchSurveyCountWitel = async (user: User, params: ParamsStateMainContentReport) => {
    const { survey_at_start, survey_at_end, surveyCategory } = params;

    useSurveyCountWitelStore.setState({ status: "pending" });
    try {
        const dataSurveyCountWitel = await getSurveyCountWitel({
            treg: user.tsel_region ? user.tsel_region : "",
            surveyid: String(surveyCategory),
            type: Number(surveyCategory) === 7 ? "bypass" : "",
            survey_at_start,
            survey_at_end,
        });
        const regional = user.tsel_region ? user.tsel_region : "";
        const dataSurvey: GetSurveyCountWitel | any = dataSurveyCountWitel[regional];
        const newData = [];
        for (const key in dataSurvey) {
            const obj = {
                ...dataSurvey[key],
                witel: key,
            };
            newData.push(obj);
        }
        const mapingData = newData.map((item) => ({
            witel: item.witel,
            unvalidated: item.unvalidated,
            invalid: item.invalid,
            validMitra: item["valid-mitra"],
            valid: item.valid,
            total: Number(item.valid) + Number(item["valid-mitra"]) + Number(item.invalid) + Number(item.unvalidated),
        }));
        useSurveyCountWitelStore.setState({ data: mapingData, status: "resolve" });
    } catch (error) {
        useSurveyCountWitelStore.setState({ status: "reject", error: errorHelper(error) });
    }
};

const getDataFilter = ({ params, setParams, user }: FiltersProps) => {
    fetchDataWitel({ params, setParams, user });
    fetchSurveyCategory();
};

const handleActivateAssignment = (args: { mysiistaId: number; type: "activate" | "deactivate" }) => {
    activateAssignmentByPolygon(args).then().catch();
};

export { fetcDataSummary, getDataFilter, handleActivateAssignment, fetchSurveyCountWitel };
