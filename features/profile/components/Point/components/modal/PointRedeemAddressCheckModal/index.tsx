import useModal from "@hooks/useModal";

import { Modal } from "@components/layout";
import { Title } from "@components/text";
import { Button } from "@components/button";

import Close from "@images/vector/close.svg";

interface PointRedeemAddressCheckModalProps {
    onClick: () => void;
}

const PointRedeemAddressCheckModal = ({ onClick }: PointRedeemAddressCheckModalProps): JSX.Element => {
    const { modal, setModal } = useModal("modal-profile-point-redeem-address-check");

    return (
        <Modal visible={modal} className="w-fit min-w-[40vw] p-6 rounded-xl">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-end">
                    <Close className="cursor-pointer" onClick={() => setModal(false)} />
                </div>
                <div className="flex flex-col items-center gap-4 w-full max-h-[70vh] overflow-auto text-center">
                    <Title size="h4" className="font-bold text-black-100">
                        Lengkapi Data Sebelum Redeem
                    </Title>
                    <p className="text-black-100">Lengkapi data diri & alamat terlebih dahulu sebelum melakukan redeem</p>
                    <div className="flex gap-4 w-full md:flex-col">
                        <Button
                            className="w-full mx-auto"
                            onClick={() => {
                                onClick();
                                setModal(false);
                            }}
                        >
                            Lengkapi Data Diri
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full mx-auto"
                            onClick={() => {
                                setModal(false);
                            }}
                        >
                            Batal
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PointRedeemAddressCheckModal;
