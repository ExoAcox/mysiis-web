import { useRouter } from "next/router";

import useModal from "@hooks/useModal";

import { Modal } from "@components/layout";
import { Title } from "@components/text";
import { Button } from "@components/button";

import Close from "@images/vector/close.svg";

interface PointRedeemAddressConfirmationModalProps {
    onClick: () => void;
}

const PointRedeemAddressConfirmationModal = ({ onClick }: PointRedeemAddressConfirmationModalProps): JSX.Element => {
    const { modal, setModal } = useModal("modal-profile-point-redeem-address-confirmation");

    const router = useRouter();

    return (
        <Modal visible={modal} className="w-fit min-w-[40vw] p-6 rounded-xl">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-end">
                    <Close className="cursor-pointer" onClick={() => setModal(false)} />
                </div>
                <div className="flex flex-col items-center gap-4 w-full pr-2 max-h-[70vh] overflow-auto text-center">
                    <Title size="h4" className="font-bold text-black-100">
                        Apakah Alamat Sudah Sesuai?
                    </Title>
                    <p className="text-black-100">Pastikan alamat Anda sudah benar agar tidak terjadi kesalahan pengiriman</p>
                    <div className="flex gap-4 w-full md:flex-col">
                        <Button
                            className="w-full mx-auto"
                            onClick={() => {
                                onClick();
                                setModal(false);
                            }}
                        >
                            Ya
                        </Button>
                        <Button
                            variant="ghost"
                            className="w-full mx-auto"
                            onClick={() => {
                                router.push("/profile/address");
                                setModal(false);
                            }}
                        >
                            Cek Kembali
                        </Button>
                    </div>
                </div>
            </div>
        </Modal>
    );
};

export default PointRedeemAddressConfirmationModal;
