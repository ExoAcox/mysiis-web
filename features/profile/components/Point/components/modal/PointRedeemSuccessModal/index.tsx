import useModal from "@hooks/useModal";

import { Modal } from "@components/layout";
import { Title } from "@components/text";
import { Button } from "@components/button";

import Close from "@images/vector/close.svg";

interface PointRedeemSuccessModalProps {
    onClick: () => void;
}

const PointRedeemSuccessModal = ({ onClick }: PointRedeemSuccessModalProps): JSX.Element => {
    const { modal, setModal } = useModal("modal-profile-point-redeem-success");

    return (
        <Modal visible={modal} className="w-fit min-w-[40vw] p-6 rounded-xl">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-end">
                    <Close className="cursor-pointer" onClick={() => setModal(false)} />
                </div>
                <div className="flex flex-col items-center gap-4 w-full max-h-[70vh] overflow-auto text-center">
                    <Title size="h4" className="font-bold text-black-100">
                        Voucher Berhasil Diredeem
                    </Title>
                    <p className="text-black-100">Hadiah akan dikirim ke alamat Anda dan poin akan berkurang sesuai jumlah poin pada voucher</p>
                    <p className="text-black-100">Cek email Anda untuk informasi selengkapnya</p>
                    <Button
                        className="w-full mx-auto"
                        onClick={() => {
                            onClick();
                            setModal(false);
                        }}
                    >
                        Oke
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default PointRedeemSuccessModal;
