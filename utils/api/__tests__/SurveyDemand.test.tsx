import { getConfiguration } from "@api/survey-demand/configuration";
import {
    activateAssignment,
    activateAssignmentByPolygon,
    addAssignment,
    addPolygon,
    generateToken,
    getDataMicrodemand,
    getInfoBatasAdministratif,
    getPolygon,
    getPolygonMicrodemand,
    getPredicCountBulding,
    getSurveyorAssignment,
    getSurveyorAssignmentTregWitel,
} from "@api/survey-demand/mysiista";
import {
    getRespondentByRegAndPolygon,
    getRespondentByValid,
    getRespondentByWitel,
    getRespondentWithResponse,
    getSurvey,
    getSurveyCount,
    getSurveyCountWitel,
    getSurveyDetail,
} from "@api/survey-demand/respondent";
import { createSupervisor, deleteSupervisor, getSupervisor, getSupervisorAssignment } from "@api/survey-demand/supervisor";
import { getSurveyCategory } from "@api/survey-demand/survey";
import { getTarget, getTargetRegional, getTargetVendor, getTargetWitel } from "@api/survey-demand/target";
import { getTahap, getVendor, getWitelByUser } from "@api/survey-demand/utility";

import { fetch } from "@functions/test";

test("getConfiguration", async () => {
    fetch({ method: "get", func: getConfiguration });
});

test("getSurveyorAssignment", async () => {
    fetch({ method: "get", func: getSurveyorAssignment });
});

test("getSurveyorAssignmentTregWitel", async () => {
    fetch({ method: "get", func: getSurveyorAssignmentTregWitel });
});

test("getDataMicrodemand", async () => {
    fetch({ method: "post", func: getDataMicrodemand, result: { data: { features: true } } });
});

test("getInfoBatasAdministratif", async () => {
    fetch({ method: "post", func: getInfoBatasAdministratif, result: { data: { data: [true] } } });
});

test("getPredicCountBulding", async () => {
    fetch({ method: "post", func: getPredicCountBulding });
});

test("getPolygon", async () => {
    fetch({ method: "get", func: getPolygon });
});

test("getPolygonMicrodemand", async () => {
    fetch({ method: "post", func: getPolygonMicrodemand, result: { data: { features: true } } });
});

test("generateToken", async () => {
    fetch({ method: "post", func: generateToken });
});

test("addAssignment", async () => {
    fetch({ method: "post", func: addAssignment });
});

test("addPolygon", async () => {
    fetch({ method: "post", func: addPolygon });
});

test("activateAssignment", async () => {
    fetch({ method: "post", func: activateAssignment });
});

test("activateAssignmentByPolygon", async () => {
    fetch({ method: "post", func: activateAssignmentByPolygon });
});

test("getRespondentByRegAndPolygon", async () => {
    fetch({ method: "get", func: getRespondentByRegAndPolygon });
});

test("getRespondentByValid", async () => {
    fetch({ method: "get", func: getRespondentByValid });
});

test("getRespondentByWitel", async () => {
    fetch({ method: "get", func: getRespondentByWitel });
});

test("getRespondentWithResponse", async () => {
    fetch({ method: "get", func: getRespondentWithResponse });
});

test("getSurvey", async () => {
    fetch({ method: "get", func: getSurvey });
});

test("getSurveyCount", async () => {
    fetch({ method: "get", func: getSurveyCount });
});

test("getSurveyCountWitel", async () => {
    fetch({ method: "get", func: getSurveyCountWitel });
});

test("getSurveyDetail", async () => {
    fetch({ method: "get", func: getSurveyDetail });
});

test("getSupervisor", async () => {
    fetch({ method: "get", func: getSupervisor });
});

test("getSupervisorAssignment", async () => {
    fetch({ method: "get", func: getSupervisorAssignment });
});

test("createSupervisor", async () => {
    fetch({ method: "post", func: createSupervisor });
});

test("deleteSupervisor", async () => {
    fetch({ method: "post", func: deleteSupervisor });
});

test("getSurveyCategory", async () => {
    fetch({ method: "get", func: getSurveyCategory });
});

test("getTarget", async () => {
    fetch({ method: "get", func: getTarget });
});

test("getTargetRegional", async () => {
    fetch({ method: "get", func: getTargetRegional });
});

test("getTargetVendor", async () => {
    fetch({ method: "get", func: getTargetVendor });
});

test("getTargetWitel", async () => {
    fetch({ method: "get", func: getTargetWitel });
});

test("getTahap", async () => {
    fetch({ method: "get", func: getTahap });
});

test("getVendor", async () => {
    fetch({ method: "get", func: getVendor });
});

test("getWitelByUser", async () => {
    fetch({ method: "get", func: getWitelByUser });
});
