import useModal from "@hooks/useModal";

import { Modal } from "@components/layout";
import { Title } from "@components/text";
import { Button } from "@components/button";

import Close from "@images/vector/close.svg";

interface PointRedeemProfileCheckModalProps {
    onClick: () => void;
}

const PointRedeemProfileCheckModal = ({ onClick }: PointRedeemProfileCheckModalProps): JSX.Element => {
    const { modal, setModal } = useModal("modal-profile-point-redeem-profile-check");

    return (
        <Modal visible={modal} className="w-fit min-w-[40vw] p-6 rounded-xl">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-end">
                    <Close className="cursor-pointer" onClick={() => setModal(false)} />
                </div>
                <div className="flex flex-col items-center gap-4 w-full max-h-[70vh] overflow-auto text-center">
                    <Title size="h4" className="font-bold text-black-100">
                        Lengkapi Data Profil
                    </Title>
                    <p className="text-black-100">Anda belum melengkapi data profile anda, silahkan lengkapi data anda</p>
                    <Button
                        type="submit"
                        className="mx-auto w-10/12 sm:w-full"
                        onClick={() => {
                            onClick();
                            setModal(false);
                        }}
                    >
                        Lengkapi Data Diri
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default PointRedeemProfileCheckModal;
