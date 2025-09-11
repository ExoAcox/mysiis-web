import useModal from "@hooks/useModal";
import Image from "next/image";
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";

import { activateAssignmentByPolygon, storeApprovalPolygon, storeToDesign } from "@api/survey-demand/mysiista";

import AccepImage from "@images/bitmap/accept_state.png";
import rejectImage from "@images/bitmap/reject_state.png";

import { Button } from "@components/button";
import { Modal } from "@components/layout";
import { Subtitle, Title } from "@components/text";
import useFetch from "@hooks/useFetch";

interface UseModal {
    status: string;
    objectid: number;
    polygon: string;
}

export default function ModalConfirm({ onSuccess }: { onSuccess: () => void }) {
    const { modal, setModal, data } = useModal<UseModal>("modal-confirm-report");
    const [loading, setLoading] = useState(false);
    const submit = useFetch<unknown>(null);

    const handleBtn = () => {
        setLoading(true);

        submit.fetch(storeToDesign({ cluster_id: data.objectid }), {
            onResolve: () => {
                onSuccess();
                submit.fetch(storeApprovalPolygon({ status: "done", id: data.objectid }), {
                    onResolve: () => {
                        setLoading(false);
                        setModal(false);
                        toast.success("Berhasil diubah");
                        onSuccess();
        
                        activateAssignmentByPolygon({ mysiistaId: data.objectid, type: "deactivate" })
                        .then(() => {
                            setLoading(false);
                            setModal(false);
                            toast.success("Berhasil diubah");
                            onSuccess();
                        })
                        .catch((error) => {
                            toast.error(error?.message);
                            setLoading(false);
                        });
                    },
                    onReject: (error) => {
                        setLoading(false);
                        toast.error(error?.message);
                    },
                });
            },
            onReject: (error) => {
                setLoading(false);
                toast.error(error?.message);
            }
        });
    };
    return (
        <Modal visible={modal} className="w-[50%]">
            <MdClose className={"cursor-pointer hover:fill-primary-40 ml-auto"} onClick={() => setModal(false)} />
            <div className="flex flex-col items-center gap-4 mt-10 px-[90px]">
                <Image src={data.status == "active" ? rejectImage : AccepImage} alt="image-alert" />
                <Title className="text-center" size="h5">{`Apakah kamu yakin polygon "${data.polygon}" dilanjutkan ke tahap design?`}</Title>
                <Subtitle size="medium" className="text-center">Polygon yang sudah di tahap design tidak dapat disurvey kembali.</Subtitle>
                <div className="flex gap-4 mt-2">
                    <Button onClick={() => setModal(false)} variant="ghost">
                        Cancel
                    </Button>
                    <Button disabled={loading} loading={loading} onClick={() => handleBtn()}>
                        Kirim
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
