import FilterIcon from "@public/images/vector/filter.svg";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Else, If, Then, When } from "react-if";

import UseModal from "@hooks/useModal";

import EmptyState from "@images/bitmap/empty_state.png";

import Tabs from "@features/planning/dashboard-microdemand/components/report/Tabs";
import { isDecimal, validationUserRole } from "@features/planning/dashboard-microdemand/functions/report";
import { fetcDataSummary, fetchSurveyCountWitel } from "@features/planning/dashboard-microdemand/queries/report";
import { useSurveyCountStore, useSurveyCountWitelStore } from "@features/planning/dashboard-microdemand/store/report";

import { Button } from "@components/button";
import { Dropdown } from "@components/dropdown";
import { Image, Responsive } from "@components/layout";
import { Pagination, PaginationInfo } from "@components/navigation";
import { Table } from "@components/table";
import { Subtitle, Title } from "@components/text";

import CardTable from "../CardTable";
import Filters from "../Filters";
import ModalConfirm from "../ModalConfirm";
import ModalConfirmBakp from "../ModalConfirmBakp";
import ModalDetail from "../ModalDetail";
import ModalFilter from "../ModalFilter";
import { Badge } from "@components/badge";
import { status } from "@grpc/grpc-js";
import ModalDetailActivity from "../ModalActivtySurveyor";

const tabOptions = [
    { label: "Surveyor", value: "surveyor" },
    { label: "Polygon", value: "polygon" },
];

interface MainContentProps {
    user: User;
    device: Device;
}

export interface ParamsStateMainContentReport {
    status: string;
    statusPolygon: string;
    surveyCategory: string;
    supervisor: boolean;
    regional: string;
    witel: string[];
    sourcename: string; // vendor
    survey_at_start: string;
    survey_at_end: string;
    page: number;
    row: number;
}

const paramsDefault = {
    status: "surveyor",
    surveyCategory: "1",
    statusPolygon: "",
    supervisor: false,
    regional: "",
    witel: [],
    sourcename: "",
    survey_at_start: dayjs().startOf("year").format("YYYY-MM-DD"),
    survey_at_end: dayjs(new Date()).format("YYYY-MM-DD"),
    page: 1,
    row: 10,
};

export default function MainContent({ user, device }: MainContentProps) {
    const { setModal: setModalFilter } = UseModal("modal-filter-report");
    const { setData: setModalConfirm } = UseModal("modal-confirm-report");
    const { setData: setModalActivity } = UseModal("modal-detail-activity-surveyor");
    const [source, setSource] = useState("surveyor");
    const [params, setParams] = useState<ParamsStateMainContentReport>(paramsDefault);
    const [surveyData, reset, status] = useSurveyCountStore((set) => [set.data, set.reset, set.status]);
    const [surveyDataWitel, statusDataWitel] = useSurveyCountWitelStore((set) => [set.data, set.status]);

    const [paramsSummaryWitel, setParamsSummaryWitel] = useState<ParamsStateMainContentReport>(paramsDefault);
    const [startPeriod, setStartPeriod] = useState(dayjs().startOf("year").format("YYYYMM"));
    const [endPeriod, setEndPeriod] = useState(dayjs().format("YYYYMM"));

    useEffect(() => {
        fetcDataSummary(user, params, source, reset);
    }, [source, params]);

    useEffect(() => {
        if (validationUserRole(user.role_keys, ["admin-survey-region"])) {
            fetchSurveyCountWitel(user, { ...paramsSummaryWitel });
        }
    }, [source, paramsSummaryWitel]);

    return (
        <Responsive className="bg-white rounded-sm shadow-md p-[24px] mb-[72px]">
            <When condition={validationUserRole(user.role_keys, ["admin-survey-region"])}>
                <div className="flex items-center justify-between">
                    <Title className="mt-5">Summary Branch</Title>
                    <div className="flex items-center gap-3 sm:flex-col">
                        <Dropdown
                            id="filter-start-period"
                            value={startPeriod}
                            options={Array.from({ length: 24 }).map((_, index) => ({
                                label: dayjs()
                                    .subtract(index - 11, "month")
                                    .format("MMMM YYYY"),
                                value: dayjs()
                                    .subtract(index - 11, "month")
                                    .format("YYYYMM"),
                            }))}
                            onChange={(value) => {
                                setStartPeriod(value);
                                setParamsSummaryWitel({ ...paramsSummaryWitel, survey_at_start: dayjs(value).format("YYYY-MM-DD") });
                            }}
                        />
                        <div className="w-4 h-[1px] bg-black sm:hidden" />
                        <Dropdown
                            id="filter-end-period"
                            value={endPeriod}
                            options={Array.from({ length: 24 }).map((_, index) => ({
                                label: dayjs()
                                    .subtract(index - 11, "month")
                                    .format("MMMM YYYY"),
                                value: dayjs()
                                    .subtract(index - 11, "month")
                                    .format("YYYYMM"),
                            }))}
                            onChange={(value) => {
                                setEndPeriod(value);
                                setParamsSummaryWitel({ ...paramsSummaryWitel, survey_at_end: dayjs(value).format("YYYY-MM-DD") });
                            }}
                        />
                    </div>
                </div>
                <Table
                    loading={statusDataWitel == "pending"}
                    className={`mt-[24px] mb-[42px]`}
                    rows={
                        surveyDataWitel.length > 0
                            ? surveyDataWitel.filter((_, index) => (params.page - 1) * params.row <= index && params.page * params.row > index)
                            : []
                    }
                    columns={[
                        {
                            header: "No",
                            value: (_, index) => (params.page - 1) * 10 + index + 1,
                            className: "text-center",
                            headerClassName: "text-center",
                        },
                        { header: "Branch", value: (data) => data.witel },
                        { header: "Unvalidated", value: (data) => data.unvalidated },
                        { header: "Invalid", value: (data) => data.invalid },
                        { header: "Valid Mitra", value: (data) => data.validMitra },
                        { header: "Valid", value: (data) => data.valid },
                        { header: "Total", value: (data) => data.total },
                    ]}
                    notFoundComponent={
                        <div className="py-8 text-center">
                            <Image src={EmptyState} width={288} />
                            <Title className="mt-4 mb-2">Data Summary Tidak Ditemukan</Title>
                            <Subtitle size="subtitle" className="text-black-80">
                                Pada akun ini tidak ditemukan Report Summary Branch
                            </Subtitle>
                        </div>
                    }
                />
            </When>
            <Title className="mb-[10px]">Summary Respondent</Title>
            <div className="border-b border-[#E9EBEF]">
                <Tabs tabs={tabOptions} onChange={(e) => setSource(e)} />
            </div>
            <If condition={device == "mobile"}>
                <Then>
                    <Button variant="ghost" onClick={() => setModalFilter(true)} className="mt-3">
                        <FilterIcon />
                        Filter
                    </Button>
                    <CardTable
                        loading={status == "pending"}
                        source={source}
                        rows={
                            surveyData.length > 0
                                ? surveyData.filter((_, index) => (params.page - 1) * params.row <= index && params.page * params.row > index)
                                : []
                        }
                    />
                </Then>
                <Else>
                    <Filters params={params} setParams={setParams} user={user} source={source} />
                    <Table
                        bodyClassName="text-center"
                        loading={status == "pending"}
                        className={`mt-[24px]`}
                        rows={
                            surveyData.length > 0
                                ? surveyData.filter((_, index) => (params.page - 1) * params.row <= index && params.page * params.row > index)
                                : []
                        }
                        columns={[
                            {
                                header: "No",
                                value: (_, index) => (params.page - 1) * 10 + index + 1,
                                className: "text-left",
                                headerClassName: "text-right",
                            },
                            { header: source == "surveyor" ? "Nama Surveyor" : "Polygon", value: (data) => data.name, className: "text-left" },
                            { header: "Branch", value: (data) => data.witel, className: "text-left" },
                            { header: "Mitra", value: (data) => data.mitra, className: "text-left" },
                            source == "surveyor"
                                ? { header: "Nama Supervisor", value: (data) => data.supervisor_name, className: "text-left" }
                                : null,
                            { header: "Unvalidated", value: (data) => data.unvalidated },
                            { header: "Invalid", value: (data) => data.invalid },
                            { header: "Valid Mitra", value: (data) => data.validMitra },
                            { header: "Valid", value: (data) => data.valid },
                            { header: "Total", value: (data) => data.total },
                            source == "polygon" ? { header: "Target", value: (data) => data.target } : null,
                            source == "polygon" ? { header: "Progress", value: (data) => isDecimal(data?.progress as number) + "%" } : null,
                            source == "polygon"
                                ? {
                                      header: "Status",
                                      value: (data) => (
                                          <Badge>{data.status}</Badge>
                                      ),
                                  }
                                : null,
                            source !== "polygon"
                                ? {
                                      header: "Aksi",
                                      value: (data) => (
                                        <Button
                                            variant="nude"
                                            onClick={() => setModalActivity({ userId: data.userId, name: data.name })}
                                        >
                                            Lihat
                                        </Button>
                                      )
                                  }
                                : {
                                    header: "Aksi",
                                    value: (data) => {
                                      if (["assigned"].includes(data.status!) && data.mitra === "telkomakses") {
                                          return (
                                              <When condition={validationUserRole(user.role_keys, ["supervisor-survey-mitra"])}>
                                                  <Button
                                                      onClick={() => setModalConfirm({ 
                                                          status: data.status, 
                                                          objectid: data.objectid, 
                                                          valid_mitra: data.validMitra, 
                                                          progress: data.progress,
                                                          unvalidated: data.unvalidated,
                                                          dokumen_bakp: data.dokumen_bakp 
                                                      })}
                                                      className="py-1.5 mx-auto m-0"
                                                  >
                                                      Selesai Survey
                                                  </Button>
                                              </When>
                                          )
                                      }

                                      return null;
                                    },
                                },
                        ]}
                        notFoundComponent={
                            <div className="py-8 text-center">
                                <Image src={EmptyState} width={288} />
                                <Title className="mt-4 mb-2">
                                    {source == "surveyor" ? "Data Surveyor Tidak Ditemukan" : "Data Polygon Tidak Ditemukan"}
                                </Title>
                                <Subtitle size="subtitle" className="text-black-80">
                                    Gunakan kata kunci lain atau ubah filter & silakan coba lagi
                                </Subtitle>
                            </div>
                        }
                    />
                </Else>
            </If>

            <div className="flex items-center justify-between gap-4 mt-8 md:flex-col md:justify-center">
                <div className="flex items-center gap-5">
                    <Dropdown
                        id="filter-dashboard-microdemand-report"
                        value={params.row}
                        options={Array.from(Array(10), (_, i) => ({ label: (i + 1) * 10, value: (i + 1) * 10 }))}
                        onChange={(value) => {
                            setParams({ ...params, row: value, page: 1 });
                        }}
                        className="max-w-[70vw]"
                        panelClassName="max-h-24"
                    />
                    <PaginationInfo row={params.row} totalCount={surveyData.length} page={params.page} />
                </div>
                <Pagination onChange={(value) => setParams({ ...params, page: value })} row={params.row} totalCount={surveyData.length} page={1} />
            </div>
            <ModalFilter params={params} setParams={setParams} user={user} />
            <ModalConfirm onSuccess={() => fetcDataSummary(user, params, source, reset)} />
            <ModalConfirmBakp />
            <ModalDetail />
            <ModalDetailActivity />
        </Responsive>
    );
}
