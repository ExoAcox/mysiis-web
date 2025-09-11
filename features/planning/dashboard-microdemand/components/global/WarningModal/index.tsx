import { MdClose } from "react-icons/md";

import { User } from "@api/account/user";

import useModal from "@hooks/useModal";

import AcceptState from "@images/bitmap/accept_state.png";
import RejectState from "@images/bitmap/reject_state.png";

import { Image, Modal } from "@components/layout";

interface Props {
    id: string;
    variant: "accept" | "reject";
    name?: string;
    message: string;
    children: React.ReactNode;
    loading: boolean;
    onClose?: () => void;
    className?: string;
}

const WarningModal: React.FC<Props> = ({ id, name, message, variant, children, loading, onClose, className }) => {
    const { modal, setModal } = useModal<User>(id);

    const closeModal = () => {
        if (!loading) setModal(false);
    };

    return (
        <Modal
            visible={modal}
            className="w-[468px]"
            loading={loading}
            onClose={() => {
                if (onClose) onClose();
            }}
        >
            <MdClose className="text-[24px] cursor-pointer hover:fill-primary-40 ml-auto" onClick={closeModal} />

            <div className="flex flex-col items-center gap-4 mt-2">
                <Image src={variant === "accept" ? AcceptState : RejectState} className="w-[288px] h-[200px]" />
                <div className="flex flex-wrap justify-center font-extrabold text-center gap-x-2 text-black-90 text-h3">
                    <span>{message}</span>
                    {name && <span>{`"${name}"?`}</span>}
                </div>
                <div className={className}>{children}</div>
            </div>
        </Modal>
    );
};

WarningModal.defaultProps = {
    className: "flex gap-2",
};

export default WarningModal;
