import SuccessState from "@public/images/bitmap/success_state.png";

import useModal from "@hooks/useModal";

import { logout } from "@functions/common";

import Close from "@images/vector/close.svg";

import { Button } from "@components/button";
import { Image, Modal } from "@components/layout";
import { Title } from "@components/text";

const MobileSuccessModal = (): JSX.Element => {
    const { modal, setModal } = useModal("modal-profile-mobile-success");

    return (
        <Modal visible={modal} className="p-6 w-fit rounded-xl">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-end">
                    <Close
                        className="cursor-pointer"
                        onClick={async () => {
                            setModal(false);
                            logout();
                        }}
                    />
                </div>
                <div className="flex flex-col items-center justify-center gap-4">
                    <Image src={SuccessState} alt="Success state" />
                    <Title size="h4" className="font-extrabold text-center text-black-100">
                        Nomor Handphone Berhasil Diubah
                    </Title>
                    <p className="text-center text-black-100">Silakan gunakan nomor handphone baru Anda untuk masuk ke mySIIS</p>
                    <Button
                        type="submit"
                        className="w-full mx-auto mt-4"
                        onClick={async () => {
                            setModal(false);
                            logout();
                        }}
                    >
                        Lanjut
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default MobileSuccessModal;
