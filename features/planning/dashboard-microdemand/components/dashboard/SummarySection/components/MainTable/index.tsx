import { Button } from "@components/button";
import { useSummaryStore } from "@features/planning/dashboard-microdemand/store/dashboard";
import { formatThousands, intersection } from "@functions/common";
import useModal from "@hooks/useModal";
import PolygonDetailModal from "../ListPolygonModal";
import { When } from "react-if";
import { useState } from "react";
import { toast } from "react-toastify";
import { MdDownload } from "react-icons/md"
import { exportListInvalid } from "@api/survey-demand/summary";
import dayjs from "dayjs";

const MainTable: React.FC<{ user: User }> = ({ user }) => {
    const detail = useModal("summary-progress-polygon");
    const [ data , grandTotal, status ] = useSummaryStore(store => [store.data, store.grandTotal, store.status]); 
    const [isShowLegend, setIsShowLegend] = useState<boolean>(false);
    const [isDownload, setIsDownload] = useState<boolean>(false);

    const handleExportListInvalid = async () => {
        if(!user.permission_keys.includes("smd-tsel.survey.download-report-activity-surveyor")){
            toast.error("You don't have permission to export summary activity surveyor");
            return;
        }

        const filename = `list_survey_invalid_${dayjs(new Date()).format("DDMMYYYY")}.xlsx`;
        try {
            setIsDownload(true);
            const result = await exportListInvalid(); 
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
        <>
            <div className="overflow-x-auto">
                <span className="font-bold italic">* Geser tabel ke arah kanan untuk melihat data lebih lengkap.</span>
                <table id="summary" className="min-w-full text-medium relative border-collapse whitespace-nowrap border border-gray-800">
                    <thead className="font-bold text-black bg-black-50">
                        <tr>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" rowSpan={3}>Area</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" rowSpan={3}>Region</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" rowSpan={3}>Branch</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" colSpan={3}>Assignment (Cluster)</th>
                            {/* <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" colSpan={5}>Izin Deployment (Cluster)</th> */}
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" colSpan={9}>Progres Survey (Cluster)</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" colSpan={5}>Hasil Survey (Rumah)</th>
                            <th className="whitespace-normal bg-secondary-20 border border-gray-800 p-1" colSpan={2}>Achievement (Cluster Assign)</th>
                            <th className="whitespace-normal bg-secondary-20 border border-gray-800 p-1" colSpan={2}>Achievement (All Cluster)</th>
                        </tr>
                        <tr>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" colSpan={2}>Status</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" rowSpan={2}>Total</th>
                            {/* <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" colSpan={4}>Status</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" rowSpan={2}>Total</th> */}
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" colSpan={8}>Status</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" rowSpan={2}>Total</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" colSpan={4}>Status</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" rowSpan={2}>Total</th>
                            <th className="whitespace-normal bg-secondary-20 border border-gray-800 p-1" rowSpan={2}>Target</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" rowSpan={2}>Progres (%)</th>
                            <th className="whitespace-normal bg-secondary-20 border border-gray-800 p-1" rowSpan={2}>Target</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" rowSpan={2}>Progres (%)</th>
                        </tr>
                        <tr>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" >Not Yet</th>
                            <th className="whitespace-nowrap bg-green-500 border border-gray-800 p-1" >Done</th>
                            {/* <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" >Not Yet</th>
                            <th className="whitespace-nowrap bg-green-500 border border-gray-800 p-1 " >Yes</th>
                            <th className="whitespace-nowrap bg-yellow-500 border border-gray-800 p-1 " >Proses</th>
                            <th className="whitespace-nowrap bg-red-500 border border-gray-800 p-1 " >No</th> */}
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" >&lt;50%</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" >50-75%</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" >76-100%</th>
                            <th className="whitespace-nowrap bg-yellow-500 border border-gray-800 p-1" >Finish</th>
                            <th className="whitespace-nowrap bg-orange-500 border border-gray-800 p-1" >Pending</th>
                            <th className="whitespace-nowrap bg-red-500 border border-gray-800 p-1" >Drop</th>
                            <th className="whitespace-pre-wrap bg-gray-400 border border-gray-800 p-1" >Waiting Permit</th>
                            <th className="whitespace-nowrap bg-green-500 border border-gray-800 p-1" >Design</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" >Submit</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" >Valid Mitra</th>
                            <th className="whitespace-nowrap  bg-green-500 border border-gray-800 p-1" >Valid</th>
                            <th className="whitespace-nowrap  bg-red-500 border border-gray-800 p-1" >Invalid</th>
                        </tr>
                    </thead>
                    <tbody>
                        {status === "resolve" && data.map((item) => (
                            <tr key={item.branch}>
                                <td className="whitespace-nowrap border border-gray-800 p-1">
                                    <Button
                                        variant="nude"
                                        onClick={() => detail.setData({ ...item, type: "area" })}
                                        disabled={intersection(user.role_keys, ["admin-survey-nasional", "admin-survey-area"]).length === 0}
                                    >
                                        {item.area}
                                    </Button>
                                </td>
                                <td className="whitespace-nowrap border border-gray-800 p-1">
                                    <Button
                                        variant="nude"
                                        onClick={() => detail.setData({ ...item, type: "region" })}
                                        disabled={intersection(user.role_keys, ["admin-survey-nasional", "admin-survey-area", "admin-survey-region"]).length === 0}
                                    >
                                        {item.region}
                                    </Button>
                                </td>
                                <td className="whitespace-nowrap border border-gray-800 p-1">
                                    <Button
                                        variant="nude"
                                        onClick={() => detail.setData({ ...item, type: "branch" })}
                                        disabled={intersection(user.role_keys, ["admin-survey-nasional", "admin-survey-area", "admin-survey-region", "admin-survey-branch", "supervisor-survey-mitra"]).length === 0}
                                    >
                                        {item.branch}
                                    </Button>
                                </td>
                                <td className="whitespace-nowrap border border-gray-800 text-right p-1">{formatThousands(item.assignment_polygon.not_yet)}</td>
                                <td className="whitespace-nowrap border border-gray-800 bg-green-500 text-right p-1">{formatThousands(item.assignment_polygon.done)}</td>
                                <td className="whitespace-nowrap border border-gray-800 text-right p-1">{formatThousands(item.assignment_polygon.total)}</td>
                                {/* <td className="whitespace-nowrap border border-gray-800 text-right p-1">{formatThousands(item.permit_polygon.not_yet)}</td>
                                <td className="whitespace-nowrap border border-gray-800 bg-green-500 text-right p-1">{formatThousands(item.permit_polygon.yes)}</td>
                                <td className="whitespace-nowrap border border-gray-800 bg-yellow-500 text-right p-1">{formatThousands(item.permit_polygon.process)}</td>
                                <td className="whitespace-nowrap border border-gray-800 bg-red-500 text-right p-1">{formatThousands(item.permit_polygon.no)}</td>
                                <td className="whitespace-nowrap border border-gray-800 text-right p-1">{formatThousands(item.permit_polygon.total)}</td> */}
                                <td className="whitespace-nowrap border border-gray-800 text-right p-1">{formatThousands(item.total_survey_polygon.low)}</td>
                                <td className="whitespace-nowrap border border-gray-800 text-right p-1">{formatThousands(item.total_survey_polygon.medium)}</td>
                                <td className="whitespace-nowrap border border-gray-800 text-right p-1">{formatThousands(item.total_survey_polygon.high)}</td>
                                <td className="whitespace-nowrap border border-gray-800 bg-yellow-500 text-right p-1">{formatThousands(item.total_survey_polygon.finish)}</td>
                                <td className="whitespace-nowrap border border-gray-800 bg-orange-500 text-right p-1">{formatThousands(item.total_survey_polygon.pending)}</td>
                                <td className="whitespace-nowrap border border-gray-800 bg-red-500 text-right p-1">{formatThousands(item.total_survey_polygon.drop)}</td>
                                <td className="whitespace-nowrap border border-gray-800 bg-gray-400 text-right p-1">{formatThousands(item.total_polygon_permits.waiting)}</td>
                                <td className="whitespace-nowrap border border-gray-800 bg-green-500 text-right p-1">{formatThousands(item.total_survey_polygon.design)}</td>
                                <td className="whitespace-nowrap border border-gray-800 text-right p-1">{formatThousands(item.total_survey_polygon.total)}</td>
                                <td className="whitespace-nowrap border border-gray-800 text-right p-1">{formatThousands(item.total_survey.unvalidated)}</td>
                                <td className="whitespace-nowrap border border-gray-800 text-right p-1">{formatThousands(item.total_survey.valid_mitra)}</td>
                                <td className="whitespace-nowrap border border-gray-800 bg-green-500 text-right p-1">{formatThousands(item.total_survey.valid)}</td>
                                <td className="whitespace-nowrap border border-gray-800 bg-red-500 text-right p-1">{formatThousands(item.total_survey.invalid)}</td>
                                <td className="whitespace-nowrap border border-gray-800 text-right p-1">{formatThousands(item.total_survey.total)}</td>
                                <td className="whitespace-normal border border-gray-800 text-right p-1">{formatThousands(item.achievement_assign.target_household)}</td>
                                <td className="whitespace-normal border border-gray-800 text-right p-1">{formatThousands(Math.round(item.achievement_assign.progress))}</td>
                                <td className="whitespace-normal border border-gray-800 text-right p-1">{formatThousands(item.achievement_all.target_household)}</td>
                                <td className="whitespace-normal border border-gray-800 text-right p-1">{formatThousands(Math.round(item.achievement_all.progress))}</td>
                            </tr>
                        ))}
                        {status === "reject" && (
                            <tr>
                                <td colSpan={20}>
                                    <div className="text-center p-2">No Data</div>
                                </td>
                            </tr>
                        )}
                        {status === "pending" && (
                            <tr>
                                <td colSpan={20}>
                                    <div className="text-center p-2">Loading...</div>
                                </td>
                            </tr>
                        )}
                        <tr className="bg-black-50">
                            <td className="whitespace-nowrap font-bold border border-gray-800 p-1 text-center" colSpan={3} >Grand Total</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(grandTotal.assignment_polygon.not_yet)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 bg-green-500 text-right p-1">{formatThousands(grandTotal.assignment_polygon.done)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(grandTotal.assignment_polygon.total)}</td>
                            {/* <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(grandTotal.permit_polygon.not_yet)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 bg-green-500 text-right p-1">{formatThousands(grandTotal.permit_polygon.yes)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 bg-yellow-500 text-right p-1">{formatThousands(grandTotal.permit_polygon.process)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 bg-red-500 text-right p-1">{formatThousands(grandTotal.permit_polygon.no)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(grandTotal.permit_polygon.total)}</td> */}
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(grandTotal.total_survey_polygon.low)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(grandTotal.total_survey_polygon.medium)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(grandTotal.total_survey_polygon.high)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 bg-yellow-500 text-right p-1">{formatThousands(grandTotal.total_survey_polygon.finish)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 bg-orange-500 text-right p-1">{formatThousands(grandTotal.total_survey_polygon.pending)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 bg-red-500 text-right p-1">{formatThousands(grandTotal.total_survey_polygon.drop)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 bg-gray-400 text-right p-1">{formatThousands(grandTotal.total_polygon_permits.waiting)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 bg-green-500 text-right p-1">{formatThousands(grandTotal.total_survey_polygon.design)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(grandTotal.total_survey_polygon.total)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(grandTotal.total_survey.unvalidated)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(grandTotal.total_survey.valid_mitra)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 bg-green-500 text-right p-1">{formatThousands(grandTotal.total_survey.valid)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 bg-red-500 text-right p-1">
                                <div className="flex items-center gap-2">
                                    <span>
                                        {formatThousands(grandTotal.total_survey.invalid)}
                                    </span>
                                    <When condition={user.permission_keys.includes("smd-tsel.survey.download-report-activity-surveyor")}>
                                        <button 
                                            className="text-black text-right"
                                            onClick={handleExportListInvalid}
                                            disabled={isDownload}
                                        >
                                            {isDownload ? "Downloading..." : <MdDownload />}
                                        </button>
                                    </When>
                                </div>
                            </td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(grandTotal.total_survey.total)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(grandTotal.achievement_assign.target_household)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(Math.round(grandTotal.achievement_assign.progress))}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(grandTotal.achievement_all.target_household)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(Math.round(grandTotal.achievement_all.progress))}</td>
                        </tr>
                    </tbody>
                </table>
                <div className="w-full m-4">
                    <Button variant="nude" onClick={()=> setIsShowLegend(!isShowLegend)}>
                        {isShowLegend ? "Sembunyikan Keterangan" : "Tampilkan Keterangan"}
                    </Button>
                    <When condition={isShowLegend}>
                        <div className="w-full grid grid-cols-2 gap-4">
                            <ul className="list-disc list-inside">
                                <li><span className="font-bold">Area:</span> Nama area</li>
                                <li><span className="font-bold">Region:</span> Nama region</li>
                                <li><span className="font-bold">Branch:</span> Nama branch</li>
                                <li><span className="font-bold">Assignment (Cluster) Done:</span> Jumlah cluster yang telah diassign ke surveyor</li>
                                <li><span className="font-bold">Assignment (Cluster) Not Yet:</span> Jumlah cluster yang belum diassign ke surveyor</li>
                                <li><span className="font-bold">Assignment (Cluster) Total:</span> Jumlah total assignment cluster pada branch</li>
                                <li><span className="font-bold">Izin Deployment (Cluster) Not Yet:</span> Jumlah cluster yang belum dilakukan survey perizinan</li>
                                <li><span className="font-bold">Izin Deployment (Cluster) Yes:</span> Jumlah cluster yang sudah diberikan izin deployment</li>
                                <li><span className="font-bold">Izin Deployment (Cluster) Proses:</span> Jumlah cluster yang masih diproses izin deploymentnya</li>
                                <li><span className="font-bold">Izin Deployment (Cluster) No:</span> Jumlah cluster yang tidak diberikan izin deployment</li>
                                <li><span className="font-bold">Izin Deployment (Cluster) Total:</span> Jumlah total izin deployment pada branch</li>
                                <li><span className="font-bold">Progres Survey (Cluster) &lt;50%:</span> Jumlah cluster yang capaian surveynya &lt;50%</li>
                                <li><span className="font-bold">Progres Survey (Cluster) 50-75%:</span> Jumlah cluster yang capaian surveynya 50-75%</li>
                                <li><span className="font-bold">Progres Survey (Cluster) 76-100%:</span> Jumlah cluster yang capaian surveynya 76-100%</li>
                            </ul>
                            <ul className="list-disc list-inside">
                                <li><span className="font-bold">Progres Survey (Cluster) Finish:</span> Jumlah cluster yang sudah selesai disurvey</li>
                                <li><span className="font-bold">Progres Survey (Cluster) Pending:</span> Jumlah cluster yang sudah di pending</li>
                                <li><span className="font-bold">Progres Survey (Cluster) Drop:</span> Jumlah cluster yang sudah di drop</li>
                                <li><span className="font-bold">Progres Survey (Cluster) Waiting Permit:</span> Jumlah cluster yang sudah selesai disurvey tapi masih menunggu permit</li>
                                <li><span className="font-bold">Progres Survey (Cluster) Design:</span> Jumlah cluster yang sudah masuk tahap design di iHLD</li>
                                <li><span className="font-bold">Progres Survey (Cluster) Total:</span> Jumlah total capaian survey cluster</li>
                                <li><span className="font-bold">Hasil Survey Submit:</span> Jumlah survey yang membutuhkan approval supervisor</li>
                                <li><span className="font-bold">Hasil Survey Valid Mitra:</span> Jumlah survey yang membutuhkan approval branch</li>
                                <li><span className="font-bold">Hasil Survey Valid:</span> Jumlah survey yang diapprove berdasarkan validasi oleh branch</li>
                                <li><span className="font-bold">Hasil Survey Invalid:</span> Jumlah survey yang ditolak berdasarkan validasi oleh branch</li>
                                <li><span className="font-bold">Achievement (Cluster Assign) Target:</span> Target berdasarkan data referensi SIFA pada cluster yang sudah di assign</li>
                                <li><span className="font-bold">Achievement (Cluster Assign) Progres:</span> Persentase progres survey berdasarkan jumlah yang telah disubmit dibagi dengan target SIFA dari cluster yang sudah di assign</li>
                                <li><span className="font-bold">Achievement (All Cluster) Target:</span> Target berdasarkan data referensi SIFA pada semua cluster</li>
                                <li><span className="font-bold">Achievement (All Cluster) Progres:</span> Persentase progres survey berdasarkan jumlah yang telah disubmit dibagi dengan target SIFA dari semua cluster</li>
                            </ul>
                        </div>
                    </When>
                </div>

                <PolygonDetailModal user={user} />
            </div>
        </>
    );
};

export default MainTable;
