import { useRef } from "react";
import { When } from "react-if";

import { getStatusAssignmentPolygon, Polygon as PolygonData, storeApprovalPolygon } from "@api/survey-demand/mysiista";

import useFetch from "@hooks/useFetch";
import useModal from "@hooks/useModal";

import { createMap, parseLatLng } from "@functions/maps";

import { BadgeStatus } from "@features/planning/dashboard-microdemand/components/global";

import { Button } from "@components/button";
import { Modal } from "@components/layout";
import { GoogleMaps } from "@components/maps";
import { ModalTitle } from "@components/text";
import { intersection } from "@functions/common";
import { toast } from "react-toastify";
import { ConfirmApprovalPendingDrop } from "../PolygonApprovalPendingDrop";

let googleMaps: Maps;
let boundaryPolygon: Polygon;

const PolygonApproval: React.FC<{ refresh: () => void, user: User }> = ({ refresh, user }) => {
    const mapRef = useRef<HTMLDivElement>(null);
    const { data, modal, setModal } = useModal<PolygonData>("polygon-approval");
    const modalConfirmApproval = useModal<{status: string}>("modal-confirm-approval");
    const modalConfirmPendingDrop = useModal<{status: string}>("modal-confirm-pending-drop");
    const submit = useFetch<unknown>(null);
    const loading = submit.status === "pending";

    const onInit = () => {
        googleMaps = createMap(mapRef.current!, { mapTypeControl: true, fullscreenControl: true });

        const paths = parseLatLng(data!.geometry);
        const color = "#cc0000";
        boundaryPolygon = new window.google.maps.Polygon({
            map: googleMaps,
            paths,
            strokeWeight: 2,
            strokeColor: color,
            fillColor: color,
            clickable: false,
        });

        const bounds = new window.google.maps.LatLngBounds();
        paths.flat().forEach((path: { lat: number; lng: number }) => {
            bounds.extend(new window.google.maps.LatLng(path.lat, path.lng));
        });

        googleMaps.fitBounds(bounds);
    };

    const closeModal = () => setModal(false);

    const getAction = (status: string) => {
        switch (status) {
            case "approved":
                return "Aktifkan";
            case "assigned":
                return "Aktifkan";
            case "pending":
                return "Pending";
            case "drop":
                return "Drop";
            default:
                return "Aktifkan";
        }
    };

    return (
        <>
            <Modal visible={modal} onClose={closeModal} loading={loading}>
                <ModalTitle onClose={closeModal}>Detail Polygon</ModalTitle>
                <div className="flex flex-row gap-4 mt-4 sm:flex-wrap md:flex-wrap">
                    <div id="maps" className="flex items-center justify-center">
                        <GoogleMaps
                            apiKey={process.env.NEXT_PUBLIC_GOOGLE_KEY_DASHBOARD_MICRODEMAND}
                            onInit={onInit}
                            mapRef={mapRef}
                            className="w-[25rem] h-[22rem] sm:w-[82vw] rounded-xl"
                        />
                    </div>
                    <div className="flex flex-col gap-1">
                        <ListItem title="Nama Polygon" value={data?.name} />
                        <ListItem title="Surveyor" value={data?.surveyor} />
                        <ListItem title="Target Houshold" value={data?.target_household} />
                        <ListItem title="Status" value={<BadgeStatus status={data?.status} />} />
                        <ListItem title="Region" value={data?.treg} />
                        <ListItem title="Branch" value={data?.witel} />
                        <ListItem title="Provinsi" value={data?.provinsi} />
                        <ListItem title="Kabupaten" value={data?.kabupaten} />
                        <ListItem title="Kecamatan" value={data?.kecamatan} />
                        <ListItem title="Desa" value={data?.desa} />
                        <ListItem title="Reason Pending" value={data?.reason_pending} />
                        <ListItem title="Reason Drop" value={data?.reason_drop} />
                    </div>
                </div>
                <div className="flex items-center justify-end gap-2">
                    <When condition={["approved", "assigned", "finished-survey"].includes(data.status!) && intersection(user.role_keys, ["admin-survey-branch", "admin-survey-region", "admin-survey-area"]).length}>
                        <div className="flex justify-end gap-4 mt-6">
                            <Button 
                                variant="filled" 
                                loading={loading}
                                disabled={loading}
                                onClick={()=> modalConfirmPendingDrop.setData({ status: "pending" })} 
                            >
                                Pending
                            </Button>
                        </div>
                    </When>
                    <When condition={["approved", "assigned", "finished-survey"].includes(data.status!) && intersection(user.role_keys, ["admin-survey-branch", "admin-survey-region", "admin-survey-area"]).length}>
                        <div className="flex justify-end gap-4 mt-6">
                            <Button 
                                variant="filled" 
                                loading={loading}
                                disabled={loading}
                                onClick={()=> modalConfirmPendingDrop.setData({ status: "drop" })} 
                            >
                                Drop
                            </Button>
                        </div>
                    </When>
                    <When condition={["pending"].includes(data.status!) && intersection(user.role_keys, ["admin-survey-branch", "admin-survey-region", "admin-survey-area"]).length}>
                        <div className="flex justify-end gap-4 mt-6">
                            <Button 
                                variant="filled" 
                                loading={loading}
                                disabled={loading}
                                onClick={()=> modalConfirmApproval.setData({ status: "approved" })} 
                            >
                                Aktifkan Polygon
                            </Button>
                        </div>
                    </When>
                    <When condition={["drop"].includes(data.status!) && intersection(user.role_keys, ["admin-survey-super"]).length}>
                        <div className="flex justify-end gap-4 mt-6">
                            <Button 
                                variant="filled" 
                                loading={loading}
                                disabled={loading}
                                onClick={()=> modalConfirmApproval.setData({ status: "approved" })} 
                            >
                                Aktifkan Polygon
                            </Button>
                        </div>
                    </When>
                    <When condition={["finished-survey"].includes(data.status!) && intersection(user.role_keys, ["supervisor-survey-mitra"]).length}>
                        <div className="flex justify-end gap-4 mt-6">
                            <Button 
                                variant="filled" 
                                loading={loading}
                                disabled={loading}
                                onClick={()=> modalConfirmApproval.setData({ status: "assigned" })} 
                            >
                                Aktifkan Polygon
                            </Button>
                        </div>
                    </When>

                </div>
            </Modal>

            <ConfirmApproval
                action={getAction(modalConfirmApproval.data?.status!)}
                status={modalConfirmApproval.data?.status! as "approved" | "assigned" | "pending" | "drop" }
                initialStatus={data.status!}
                polygon_id={data.objectid}
                submit={submit}
                refresh={refresh}
            />
            <ConfirmApprovalPendingDrop
                action={getAction(modalConfirmPendingDrop.data?.status!)}
                status={modalConfirmPendingDrop.data?.status! as "pending" | "drop" }
                initialStatus={data.status!}
                polygon_id={data.objectid}
                submit={submit}
                refresh={refresh}
            />
        </>
    );
};

export default PolygonApproval;

const ListItem: React.FC<{ title: string; value: any }> = ({ title, value }) => {
    return (
        <div className="grid items-center grid-cols-2 gap-2">
            <div className="text-sm text-[#7F8FA4]">{title}</div>
            <div className="text-sm text-[#1F2937]">{value ?? "-"}</div>
        </div>
    );
};

const ConfirmApproval: React.FC<{ 
    action: "Drop" | "Pending" | "Approve" | "Assign" | "Aktifkan",
    status: "approved" | "assigned" | "pending" | "drop",
    initialStatus: string,
    polygon_id: number;
    submit: ReturnType<typeof useFetch>,
    refresh: () => void;
}> = ({ polygon_id, action, status, initialStatus, submit, refresh }) => {

    const { modal, setModal } = useModal("modal-confirm-approval");
    const modalDetail = useModal("polygon-approval");

    const closeModal = () => {
        setModal(false);
    }

    const handleSubmit = async () => {      
        const statusAssign = await getStatusAssignmentPolygon({ id: polygon_id });
        const currentStatus = statusAssign ? "assigned" : status;

        submit.fetch(storeApprovalPolygon({ id: polygon_id, status: currentStatus }), {
            onResolve: () => {
                closeModal();
                modalDetail.setModal(false);
                refresh();
                toast.success("Berhasil mengubah status polygon");
            },
            onReject: (error) => {
                toast.error(error?.message);
            }
        });
    };

    return (
        <Modal visible={modal}>
            <ModalTitle>Konfirmasi {action} Polygon</ModalTitle>
            <div className="flex flex-col gap-4 mt-4">
                <div className="flex justify-end gap-4 mt-6">
                    <Button onClick={closeModal} variant="ghost" className="flex-1">
                        Batal
                    </Button>
                    <Button onClick={handleSubmit} className="flex-1">
                        Kirim
                    </Button>
                </div>
            </div>
        </Modal>
    );
};