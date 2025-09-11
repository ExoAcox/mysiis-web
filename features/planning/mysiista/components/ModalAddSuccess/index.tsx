import success from "@public/images/bitmap/success_state.png";
import Image from "next/image";
import React from "react";
import { MdClose } from "react-icons/md";

import useModal from "@hooks/useModal";

import { Button } from "@components/button";
import { Modal } from "@components/layout";
import { Subtitle, Title } from "@components/text";

function ModalAddSuccess() {
    const { modal, setModal } = useModal("modal-success");

    return (
        <Modal visible={modal} className="w-[479px] h-[500px] overflow-hidden relative">
            <div className="absolute right-[20px] top-[20px]">
                <MdClose className="cursor-pointer hover:fill-primary-40" onClick={() => setModal(false)} />
            </div>
            <div className="mt-5 flex flex-col items-center">
                <Image src={success} alt="logo-success" />
                <Title className="mt-[10px]">Gambar Berhasil Disimpan</Title>
                <Subtitle>Gambar polygon telah berhasil di simpan</Subtitle>
                <Button className="w-full mt-[16px]" onClick={() => setModal(false)}>
                    Ok
                </Button>
            </div>
        </Modal>
    );
}

export default ModalAddSuccess;
