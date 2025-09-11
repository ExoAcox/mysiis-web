import { Button } from "@components/button";
import { useSummaryPermitsStore } from "@features/planning/dashboard-permit/store/dashboard";
import { formatThousands, intersection } from "@functions/common";
import useModal from "@hooks/useModal";
import PolygonDetailModal from "../ListPolygonModal";

const MainTable: React.FC<{ user: User }> = ({ user }) => {
    const detail = useModal("summary-progress-polygon-permits");
    const [ data , grandTotal, status ] = useSummaryPermitsStore(store => [store.data, store.grandTotal, store.status]); 

    return (
        <>
            <div className="overflow-x-auto">
                <table id="summary-permit" className="min-w-full text-medium relative border-collapse whitespace-nowrap border border-gray-800">
                    <thead className="font-bold text-black bg-black-50">
                        <tr>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" rowSpan={2}>Regional</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" rowSpan={2}>Witel</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" rowSpan={2}>Drop / Pending</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" colSpan={3}>Permit Not Yet</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" colSpan={3}>Permit Process</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1" colSpan={3}>Permit Rejected</th>
                            <th className="whitespace-normal bg-secondary-20 border border-gray-800 p-1" colSpan={3}>Permit Approved</th>
                            <th className="whitespace-normal bg-secondary-20 border border-gray-800 p-1" rowSpan={2}>Done</th>
                        </tr>
                        <tr>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1">Progress Survey</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1">Done Survey</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1">Total</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1">Progress Survey</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1">Done Survey</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1">Total</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1">Progress Survey</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1">Done Survey</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1">Total</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1">Progress Survey</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1">Done Survey</th>
                            <th className="whitespace-nowrap bg-secondary-20 border border-gray-800 p-1">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {status === "resolve" && data.map((item) => (
                            <tr key={item.witel}>
                                <td className="whitespace-nowrap border border-gray-800 p-1">
                                    <Button
                                        variant="nude"
                                        onClick={() => detail.setData({ ...item, type: "regional" })}
                                        disabled={intersection(user.role_keys, ["admin-survey-nasional", "admin-survey-region"]).length === 0}
                                    >
                                        {item.regional}
                                    </Button>
                                </td>
                                <td className="whitespace-nowrap border border-gray-800 p-1">
                                    <Button
                                        variant="nude"
                                        onClick={() => detail.setData({ ...item, type: "witel" })}
                                        disabled={intersection(user.role_keys, ["admin-survey-nasional", "admin-survey-region", "supervisor-survey-mitra"]).length === 0}
                                    >
                                        {item.witel}
                                    </Button>
                                </td>
                                <td className="whitespace-nowrap border border-gray-800 text-right p-1">{formatThousands(item.drop_pending)}</td>
                                <td className="whitespace-nowrap border border-gray-800 text-right p-1">{formatThousands(item.permits_not_yet.ogp_survey)}</td>
                                <td className="whitespace-nowrap border border-gray-800 text-right p-1">{formatThousands(item.permits_not_yet.done)}</td>
                                <td className="whitespace-nowrap border border-gray-800 text-right p-1">{formatThousands(item.permits_not_yet.ogp_survey + item.permits_not_yet.done)}</td>
                                <td className="whitespace-nowrap border border-gray-800 text-right p-1">{formatThousands(item.permits_process.ogp_survey)}</td>
                                <td className="whitespace-nowrap border border-gray-800 text-right p-1">{formatThousands(item.permits_process.done)}</td>
                                <td className="whitespace-nowrap border border-gray-800 text-right p-1">{formatThousands(item.permits_process.ogp_survey + item.permits_process.done)}</td>
                                <td className="whitespace-nowrap border border-gray-800 text-right p-1">{formatThousands(item.permits_rejected.ogp_survey)}</td>
                                <td className="whitespace-nowrap border border-gray-800 text-right p-1">{formatThousands(item.permits_rejected.done)}</td>
                                <td className="whitespace-nowrap border border-gray-800 text-right p-1">{formatThousands(item.permits_rejected.ogp_survey + item.permits_rejected.done)}</td>
                                <td className="whitespace-nowrap border border-gray-800 text-right p-1">{formatThousands(item.permits_approved.ogp_survey)}</td>
                                <td className="whitespace-nowrap border border-gray-800 text-right p-1">{formatThousands(item.permits_approved.done)}</td>
                                <td className="whitespace-nowrap border border-gray-800 text-right p-1">{formatThousands(item.permits_approved.ogp_survey + item.permits_approved.done)}</td>
                                <td className="whitespace-nowrap border border-gray-800 text-right p-1">{formatThousands(item.ihld_sent.done)}</td>
                            </tr>
                        ))}
                        {status === "resolve" && data.length === 0 && (
                            <tr>
                                <td colSpan={20}>
                                    <div className="text-center p-2">Data not found.</div>
                                </td>
                            </tr>
                        )}
                        {status === "reject" && (
                            <tr>
                                <td colSpan={20}>
                                    <div className="text-center p-2">Failed load data.</div>
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
                            <td className="whitespace-nowrap font-bold border border-gray-800 p-1 text-center" colSpan={2} >Grand Total</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(grandTotal.drop_pending)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(grandTotal.permits_not_yet.ogp_survey)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(grandTotal.permits_not_yet.done)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(grandTotal.permits_not_yet.ogp_survey + grandTotal.permits_not_yet.done)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(grandTotal.permits_process.ogp_survey)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(grandTotal.permits_process.done)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(grandTotal.permits_process.ogp_survey + grandTotal.permits_process.done)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(grandTotal.permits_rejected.ogp_survey)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(grandTotal.permits_rejected.done)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(grandTotal.permits_rejected.ogp_survey + grandTotal.permits_rejected.done)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(grandTotal.permits_approved.ogp_survey)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(grandTotal.permits_approved.done)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(grandTotal.permits_approved.ogp_survey + grandTotal.permits_approved.done)}</td>
                            <td className="whitespace-nowrap font-bold border border-gray-800 text-right p-1">{formatThousands(grandTotal.ihld_sent.done)}</td>
                        </tr>
                    </tbody>
                </table>

                <PolygonDetailModal user={user} />
            </div>
        </>
    );
};

export default MainTable;
