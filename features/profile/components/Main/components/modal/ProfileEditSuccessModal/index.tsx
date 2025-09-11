import useModal from "@hooks/useModal";

import { Modal, Image } from "@components/layout";
import { Title } from "@components/text";
import { Button } from "@components/button";

import Close from "@images/vector/close.svg";
import SuccessState from "@public/images/bitmap/success_state.png";

const ProfileEditSuccessModal = (): JSX.Element => {
    const { modal, setModal } = useModal("modal-profile-edit-success");

    return (
        <Modal visible={modal} className="w-fit p-6 rounded-xl">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-end">
                    <Close className="cursor-pointer" onClick={() => setModal(false)} />
                </div>
                <div className="flex flex-col items-center justify-center gap-4">
                    <Image src={SuccessState} alt="Success state" />
                    <Title size="h4" className="font-extrabold text-black-100">
                        Profil Berhasil Diubah
                    </Title>
                    <Button type="submit" className="mx-auto mt-8 sm:w-full w-10/12" onClick={() => setModal(false)}>
                        Masuk ke halaman profile mySIIS
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default ProfileEditSuccessModal;
