import useModal from "@hooks/useModal";
// import { useRouter } from 'next/router';
import React, { useState } from "react";
import { MdClose } from "react-icons/md";
import { toast } from "react-toastify";

import { activateAssignmentByPolygon, storeApprovalPolygon } from "@api/survey-demand/mysiista";

import { Button } from "@components/button";
import { Modal } from "@components/layout";
import { Title } from "@components/text";
import { TextArea } from "@components/input";
import { When } from "react-if";

interface UseModal {
    status: string;
    objectid: number;
    dokumen_bakp: string;
    valid_mitra: number;
    unvalidated: number;
    progress: number;
}

export default function ModalConfirm({ onSuccess }: { onSuccess: () => void }) {
    // const router = useRouter();
    const { modal, setModal, data } = useModal<UseModal>("modal-confirm-report");
    // const modalBakp = useModal<UseModal>("modal-confirm-bakp");
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState("");

    const handleBtn = () => {
        // if(data.valid_mitra !== 0 || data.unvalidated !== 0){
        //     toast.error(`Polygon tidak bisa diakhiri karena masih ada ${data.unvalidated+data.valid_mitra} data survey yang belum selesai di validasi`);
        //     return;
        // }

        // if(!data.dokumen_bakp){
        //     toast.error("Polygon tidak bisa diakhiri karena dokumen BAKP belum di upload");
        //     modalBakp.setModal(true);
        //     return;
        // }

        if(reason === "" && data.progress < 100){
            toast.error("Alasan harus diisi");
            return;
        }
        
        setLoading(true);
        storeApprovalPolygon({ id: data.objectid, status: "finished-survey", reason }).then(() => {
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
        <Modal visible={modal}>
            <MdClose className={"cursor-pointer hover:fill-primary-40 ml-auto"} onClick={() => setModal(false)} />
            <div className="flex flex-col items-center gap-4">
                <Title className="text-center" size="medium">{`Apakah anda yakin ingin mengakhiri survey di polygon ini ?`}</Title>
                <div className="w-full">
                    <When condition={data.progress < 100}>
                        <TextArea 
                            className="w-full"
                            label="Alasan mengakhiri survey"
                            placeholder="Contoh: Tidak bisa mencapai target karena: 10 toko, 3 sekolah, bangunan hanya 50."
                            value={reason}
                            onChange={(value) => setReason(value)}
                        />
                    </When>
                </div>
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
