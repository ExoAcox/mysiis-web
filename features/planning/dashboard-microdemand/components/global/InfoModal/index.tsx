import { Modal, Image } from "@components/layout";
import { Button } from "@components/button";
import { MdClose } from "react-icons/md";

import SuccessState from "@images/bitmap/success_state.png";
import FailedState from "@images/bitmap/error_state_2.png";

const button = {
    success: "Oke",
    failed: "Tutup",
};

interface Props {
    visible: boolean;
    children: React.ReactNode;
    variant: "success" | "failed";
    onClose?: () => void;
}

const InfoModal: React.FC<Props> = ({ visible, children, variant, onClose }) => {
    const closeModal = () => {
        if (onClose) onClose();
    };

    return (
        <Modal visible={visible} className="w-[468px]">
            <MdClose className="text-[24px] cursor-pointer hover:fill-primary-40 ml-auto" onClick={closeModal} />

            <div className="flex flex-col items-center gap-4 mt-2">
                <Image src={variant === "success" ? SuccessState : FailedState} className="w-[288px] h-[200px]" />
                <div className="flex flex-wrap justify-center font-extrabold text-center gap-x-2 text-black-90 text-h3">{children}</div>
                <Button className="px-8" onClick={closeModal}>
                    {button[variant]}
                </Button>
            </div>
        </Modal>
    );
};

export default InfoModal;
