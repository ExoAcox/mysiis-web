import { useRouter } from "next/router";

import useModal from "@hooks/useModal";

import { Modal, Image } from "@components/layout";
import { Title } from "@components/text";
import { Button } from "@components/button";

import Close from "@images/vector/close.svg";
import SuccessState from "@public/images/bitmap/success_state.png";

const PasswordSuccessModal = (): JSX.Element => {
    const { modal, setModal } = useModal("modal-profile-password-success");

    const router = useRouter();

    return (
        <Modal visible={modal} className="w-fit p-6 rounded-xl">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-end">
                    <Close
                        className="cursor-pointer"
                        onClick={() => {
                            setModal(false);
                            router.push("/profile");
                        }}
                        title="close-svg"
                    />
                </div>
                <div className="flex flex-col items-center justify-center gap-4">
                    <Image src={SuccessState} alt="Success state" />
                    <Title size="h4" className="font-extrabold text-black-100">
                        Password Berhasil Diubah
                    </Title>
                    <p className="text-black-100">Terima kasih telah mengganti password Anda</p>
                    <Button
                        type="submit"
                        className="mx-auto mt-8 sm:w-full w-10/12"
                        onClick={() => {
                            setModal(false);
                            router.push("/profile");
                        }}
                    >
                        Masuk ke halaman profil mySIIS
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default PasswordSuccessModal;
