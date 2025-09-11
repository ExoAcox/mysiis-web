import React, { useEffect, useState } from "react";
import { When } from "react-if";
import dayjs from "dayjs";
import customParseFormat from 'dayjs/plugin/customParseFormat';

import useModal from "@hooks/useModal";
import { Modal } from "@components/layout";
import { ModalTitle } from "@components/text";
import { exportSummaryPolygon, GetSummaryDetail, getSummaryPolygon } from "@api/survey-demand/summary";
import { useFilterSummaryStore } from "@features/planning/dashboard-microdemand/store/dashboard";
import { Pagination } from "@features/planning/dashboard-microdemand/components/global";
import { SurveyCount } from "@api/survey-demand/respondent";
import { Table } from "@components/table";
import { isDecimal } from "@features/planning/dashboard-microdemand/functions/report";
import { tw } from "@functions/style";
import { Button } from "@components/button";
import ModalConfirm from "../ModalConfirm";
import ModalConfirmFinishSurvey from "../ModalConfirmFinishSurvey";
import { Badge } from "@components/badge";
import { Dropdown } from "@components/dropdown";
import { optionsStatus, optionsStatusPermit } from "@features/planning/dashboard-microdemand/functions/common";
import { intersection } from "@functions/common";
import ModalLogStatus from "../ModalLogStatus";
import useFetch from "@hooks/useFetch";
import { toast } from "react-toastify";
import { TextField } from "@components/input";
import ModalPreSurvey from "../ModalPreSurvey";

dayjs.extend(customParseFormat);

let debounce: NodeJS.Timeout;

dayjs.extend(customParseFormat);

const accessNextDesign = [
    "admin-survey-nasional",
    "admin-survey-area",
    "admin-survey-region",
    "admin-survey-branch",
];

const vendors = [
    { label: "Semua vendor", value: "" },
    { label: "Telkom Akses", value: "telkomakses" },
    { label: "Enciety", value: "enciety" },
];

const PolygonDetailModal: React.FC<{ user: User }> = ({ user }) => {
    const { modal, data, setModal } = useModal<GetSummaryDetail>("summary-progress-polygon");
    const { setData: setModalConfirm } = useModal("modal-confirm-report");
    const { setData: setModalConfirmFinishSurvey } = useModal("modal-confirm-finish-survey");
    const modalLogs = useModal("modal-log-status");
    const modalPreSurvey = useModal("modal-pre-survey");
    const filter = useFilterSummaryStore();
    const [list, setList] = useState<SurveyCount[]>([]);
    const [totalData, setTotalData] = useState<number>(0);
    const [loading, setLoading] = useState(false);
    const [reset, setReset] = useState(false);
    const [status, setStatus] = useState<string>("");
    const [statusPermit, setStatusPermit] = useState<string>("");
    
    const closeModal = () => {
        filter.reset();
        setModal(false);
    };

    const onPageChange = (page: number) => {
        filter.set({ page });
        // fetchSurvey({ ...filterStore, page }, "isSamePage");
    };

    const onRowChange = (row: number) => {
        filter.set({ row });
    };

    const getParams = () => {
        const params: { [key: string]: any } = {};
            
        if(data.type === "area") {
            params.area = data.area;
        } else if(data.type === "region") {
            params.area = data.area;
            params.region = data.region;
        } else if(data.type === "branch") {
            params.area = data.area;
            params.region = data.region;
            params.branch = data.branch;
        }

        if(status !== "") params.status = status;

        return params;
    }

    const fetchDataSummary = (search? : string) => {
        const params = getParams();
        if(status !== "") params.status = status;
        if(statusPermit !== "") params.status_permits = statusPermit;
        params.search = search ? search : "";
        
        setLoading(true);
        getSummaryPolygon({ 
            ...params,
            page: filter.page,
            row: filter.row,
            vendor: filter.vendor, 
        })
        .then((response) => {
            setList(response.lists);
            setTotalData(response.totalData)
        })
        .catch((error) => {
            setList([]);
            // toast.error(JSON.stringify(error.message));
        })
        .finally(() => {
            setLoading(false)
        });
    }

    useEffect(() => {
        if (modal) {
            filter.reset();
            fetchDataSummary();
        }
    }, [modal, status, statusPermit, reset, filter.page, filter.row, filter.vendor]);

    const handleExport = async () => {
        const params = getParams();
        if(filter.vendor !== ""){
            params.vendor = filter.vendor;
        }

        let level = "";
        if(data.type === "area") {
            level = data.area;
        } else if(data.type === "region") {
            level = data.region;
        } else if(data.type === "branch") {
            level = data.branch;
        }

        const filename = `Summary_progress_polygon_${level}_${dayjs(new Date()).format("DDMMYYYY")}.xlsx`;

        try {
            const result = await exportSummaryPolygon({ ...params }); 
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
            }
        } catch (error) {
            toast.error("Failed export summary polygon");
        }
    };

    return (
        <Modal
            className="w-[80%] sm:w-full max-h-[80%] overflow-y-auto"
            visible={modal}
            // onClose={closeModal}
            // onBackgroundClick={closeModal}
        >
            <ModalTitle onClose={closeModal}>Summary Progress Polygon</ModalTitle>
            <div className="p-4">
                <div className="w-full flex flex-wrap justify-between items-center gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                        <Dropdown
                            id="filter-status"
                            label="Status Microdemand"
                            placeholder="Pilih Status"
                            value={status}
                            options={optionsStatus}
                            onChange={(value) => {
                                setStatus(value);
                            }}
                        />
                        <Dropdown
                            id="filter-status"
                            label="Status Permit"
                            placeholder="Pilih Status"
                            value={statusPermit}
                            options={optionsStatusPermit}
                            onChange={(value) => {
                                setStatusPermit(value);
                            }}
                        />
                        <Dropdown
                            id="filter-vendor"
                            label="Vendor"
                            placeholder="Pilih Vendor"
                            value={filter.vendor}
                            options={vendors}
                            disabled={user.vendor !== "All"}
                            onChange={(value) => {
                                filter.set({ vendor: value })
                            }}
                        />
                        <TextField
                            label={"Cari"}
                            value={filter.search}
                            onChange={(search) => {                                
                                filter.set({ search, page: 1 });
                                setLoading(true);

                                clearTimeout(debounce);
                                debounce = setTimeout(() => {
                                    fetchDataSummary(search);
                                }, 1000);
                            }}
                            className="pl-2"
                            placeholder="Cari Nama Polygon..."
                            parentClassName="w-52"
                        />
                    </div>
                    <Button
                        className="py-3 mx-auto m-0"
                        onClick={handleExport}
                        >
                        Unduh Laporan
                    </Button>
                </div>
                <Table
                    bodyClassName="text-center"
                    loading={loading}
                    className="mt-2"
                    rows={list}
                    columns={[
                        { header: "Area", value: (data) => data.polygon?.area, className: "text-left whitespace-nowrap" },
                        { header: "Region", value: (data) => data.polygon?.treg, className: "text-left whitespace-nowrap" },
                        { header: "Branch", value: (data) => data.polygon?.witel, className: "text-left whitespace-nowrap" },
                        { header: "Regional", value: (data) => data.polygon?.telkom_regional, className: "text-left whitespace-nowrap" },
                        { header: "Witel", value: (data) => data.polygon?.telkom_witel, className: "text-left whitespace-nowrap" },
                        { header: "Vendor", value: (data) => data.polygon?.surveyor, className: "text-left whitespace-nowrap" },
                        { header: "ID Polygon", value: (data) => data.polygon?.objectid, className: "text-left whitespace-nowrap" },
                        { header: "Nama Polygon", value: (data) => data.polygon?.name, className: "text-left" },
                        { header: "Assign", value: (data) => ["assigned","permits-approved","permits-process","permits-rejected","finished-survey","done"].includes(data.polygon?.status!) ? "Sudah" : "Belum", className: "text-left" },
                        { header: "Permit", value: (data) => {
                            if(data.polygon?.dokumen_bakp) {
                                return (
                                    <a className="text-blue-500 underline" href={data.polygon?.dokumen_bakp!} target="_blank" download={data.polygon?.name+".pdf"}>Sudah</a>
                                );
                            } else {
                                return "Belum";
                            }
                        }, className: "text-left" },
                        {header: "Pre Survey", value: (data) => {
                            return (
                                <div title="Lihat log status">
                                    <Button variant="nude" onClick={()=> modalPreSurvey.setData(data.polygon?.objectid)}>
                                        Lihat
                                    </Button>
                                </div>
                            )
                        }},
                        { header: "Submit", value: (data) => data.respondent.unvalidated },
                        { header: "Valid Mitra", value: (data) => data.respondent.valid_mitra },
                        { header: "Valid", value: (data) => data.respondent.valid },
                        { header: "Invalid", value: (data) => data.respondent.invalid },
                        { header: "Total", value: (data) => Object.values(data.respondent).reduce((acc, value) => Number(acc) + Number(value), 0) },
                        { header: "Target", value: (data) => data.polygon?.target_household},
                        { header: "Progress", value: (data) => <ProgressPolygon progress={Number(Object.values(data.respondent).reduce((acc, value) => Number(acc) + Number(value) / Number(data.polygon?.target_household) * 100, 0))} /> },
                        { header: "High", value: (data) => data.priority?.high ?? 0},
                        { header: "Medium", value: (data) => data.priority?.medium ?? 0},
                        { header: "Low", value: (data) => data.priority?.low ?? 0},
                        { header: "Surveyor", value: (data) => data.user_last_survey ?? "-" },
                        { header: "Tanggal Survey", value: (data) => data.date_last_survey ? dayjs(data.date_last_survey).format("DD MMM YYYY") : "-" },
                        {header: "Status Microdemand", value: (data) => {
                            return (
                                <div title="Lihat log status">
                                    <Button variant="nude" onClick={()=> modalLogs.setData(data.log_status)}>
                                        <Badge>
                                            {data.polygon?.status}
                                        </Badge>
                                    </Button>
                                </div>
                            )
                        }},
                        {header: "Status Permit", value: (data) => {
                            return (
                                <Badge>{data.polygon?.status_permits}</Badge>
                            )}
                        },
                        {header: "Aksi", value: (data) => {
                            if(data.polygon?.surveyor === "telkomakses"){
                                if(data.polygon.status === "done" && data.polygon?.status_permits !== "done"){
                                    return (
                                        <span>Menunggu permit</span>
                                    )
                                } else if(data.polygon?.status === "done" && data.polygon?.status_permits === "done"){
                                    return "";
                                } else {
                                    return (
                                        <When condition={intersection(user.role_keys, accessNextDesign).length && user.vendor === "All"}>
                                            <Button
                                                className="py-1.5 mx-auto m-0"
                                                disabled={data.polygon?.status !== "finished-survey"}
                                                onClick={() => setModalConfirm({ status: data.polygon?.status, objectid: data.polygon?.objectid, polygon: data.polygon?.name }) }
                                            >
                                                <span title={data.polygon?.status !== "finished-survey" ? "Maaf polygon ini belum ber status finished-survey" : ""}>
                                                    Lanjut Design
                                                </span>
                                            </Button>
                                        </When>
                                    )
                                }
                            } else {
                                if(data.polygon?.status === "finished-survey"){
                                    if(data?.is_ready_design){
                                        return (
                                            <When condition={intersection(user.role_keys, accessNextDesign).length && user.vendor === "All"}>
                                                <Button
                                                    className="py-1.5 mx-auto m-0"
                                                    disabled={data.polygon?.status !== "finished-survey"}
                                                    onClick={() => setModalConfirm({ status: data.polygon?.status, objectid: data.polygon?.objectid, polygon: data.polygon?.name }) }
                                                >
                                                    <span title={data.polygon?.status !== "finished-survey" ? "Maaf polygon ini belum ber status finished-survey" : ""}>
                                                        Lanjut Design
                                                    </span>
                                                </Button>
                                            </When>
                                        )
                                    } else {
                                        return (
                                            <span>Proses Analisis</span>
                                        )
                                    }
                                } else {
                                    return (
                                        <Button
                                            className="py-1.5 mx-auto m-0"
                                            disabled={data.polygon?.status !== "assigned"}
                                            onClick={() => setModalConfirmFinishSurvey({ status: data.polygon?.status, objectid: data.polygon?.objectid }) }
                                        >
                                            <span title={data.polygon?.status !== "assigned" ? "Maaf polygon ini belum ber status assigned" : ""}>
                                                Selesaikan Survey
                                            </span>
                                        </Button>
                                    )
                                }
                            }
                        }}
                    ]}
                    notFoundComponent={
                        <div className="py-8 text-center">
                            DATA TIDAK DITEMUKAN
                        </div>
                    }
                />
            </div>
            <Pagination row={filter.row} totalCount={totalData} page={filter.page} onPageChange={onPageChange} onRowChange={onRowChange} />
            <ModalLogStatus />
            <ModalConfirm onSuccess={() => setReset(true)} />
            <ModalConfirmFinishSurvey onSuccess={() => setReset(true)} />
            <ModalPreSurvey />
        </Modal>
    );
};

export default PolygonDetailModal;

const ProgressPolygon: React.FC<{ progress: number }> = ({ progress }) => {
    let color;
    if (progress < 50) {
        color = "bg-red-500";
    } else if (progress < 75) {
        color = "bg-yellow-500";
    } else {
        color = "bg-green-500";
    }
    
    return (
        <div className="flex items-center gap-2">
            <div className="relative w-full h-5 bg-gray-200 rounded-md">
                <div
                    className={tw(color, "h-5 rounded-md text-xs")}
                    style={{ width: `${progress}%` }}
                >
                </div>
            </div>
            <span className="absolute ml-1">{isDecimal(progress) ? progress.toFixed(0) : progress}%</span>
        </div>
    );
};

