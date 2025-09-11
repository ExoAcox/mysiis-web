import useModal from "@hooks/useModal";
import Image from "next/image";
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";

import { activateAssignmentByPolygon, storeApprovalPolygon } from "@api/survey-demand/mysiista";

import AccepImage from "@images/bitmap/accept_state.png";
import rejectImage from "@images/bitmap/reject_state.png";

import { Button } from "@components/button";
import { Modal } from "@components/layout";
import { Title } from "@components/text";

interface UseModal {
    status: string;
    objectid: number;
}

export default function ModalConfirm({ onSuccess }: { onSuccess: () => void }) {
    const { modal, setModal, data } = useModal<UseModal>("modal-confirm-finish-survey");
    const [loading, setLoading] = useState(false);

    const handleBtn = () => {
        setLoading(true);
        storeApprovalPolygon({ id: data.objectid, status: "finished-survey" }).then(() => {
            activateAssignmentByPolygon({ mysiistaId: data.objectid, type: "deactivate" })
                .then(() => {
                    setModal(false);
                    onSuccess();
                })
                .catch((error) => {
                    toast.error(error?.message);
                })
        })
        .catch((error) => {
            toast.error(error?.message);
        })
        .finally(() => {
            setLoading(false);
        });
    };
    return (
        <Modal visible={modal} className="w-[50%]">
            <MdClose className={"cursor-pointer hover:fill-primary-40 ml-auto"} onClick={() => setModal(false)} />
            <div className="flex flex-col items-center gap-4 mt-10 px-[90px]">
                <Image src={data.status == "active" ? rejectImage : AccepImage} alt="image-alert" />
                <Title className="text-center" size="h5">{`Apakah anda yakin ingin mengakhiri survey di polygon ini ?`}</Title>
                <div className="flex gap-4 mt-2">
                    <Button onClick={() => setModal(false)} variant="ghost">
                        Cancel
                    </Button>
                    <Button disabled={loading} loading={loading} onClick={() => handleBtn()}>
                        Submit
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
