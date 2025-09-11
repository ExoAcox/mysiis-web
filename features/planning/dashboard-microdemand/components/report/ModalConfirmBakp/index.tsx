import useModal from "@hooks/useModal";
import { useRouter } from 'next/router';
import Image from "next/image";
import React from "react";
import { MdClose } from "react-icons/md";

import AccepImage from "@images/bitmap/accept_state.png";

import { Button } from "@components/button";
import { Modal } from "@components/layout";
import { Title } from "@components/text";


export default function ModalConfirm() {
    const router = useRouter();
    const { modal, setModal, data } = useModal("modal-confirm-bakp");
    const modalReport = useModal("modal-confirm-report");

    const handleBtn = () => {
        router.push('/planning/dashboard-microdemand/permit');
        setModal(false);
        modalReport.setModal(false);
        return;
    };

    return (
        <Modal visible={modal} className="w-[50%]">
            <MdClose className={"cursor-pointer hover:fill-primary-40 ml-auto"} onClick={() => setModal(false)} />
            <div className="flex flex-col items-center gap-4 mt-10 px-[90px]">
                <Image src={AccepImage} alt="image-alert" />
                <Title className="text-center" size="h5">{`Apakah anda ingin melanjutkan ke halaman upload BAKP ?`}</Title>
                <div className="flex gap-4 mt-2">
                    <Button onClick={() => {
                        setModal(false);
                        modalReport.setModal(false);
                    }} variant="ghost">
                        Batal
                    </Button>
                    <Button onClick={() => handleBtn()}>
                        Lanjutkan
                    </Button>
                </div>
            </div>
        </Modal>
    );
}
