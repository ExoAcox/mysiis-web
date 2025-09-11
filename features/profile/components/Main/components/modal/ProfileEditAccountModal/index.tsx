import useModal from "@hooks/useModal";

import Close from "@images/vector/close.svg";

import ProfileEdit, { ProfileEditProps } from "@features/profile/components/Main/components/ProfileEdit";

import { Modal } from "@components/layout";

const ProfileEditAccountModal = ({
    profile,
    input,
    handleInputImage,
    errorSize,
    handleUpdate,
    setInput,
    isEmptyProfile,
}: ProfileEditProps): JSX.Element => {
    const { modal, setModal } = useModal("modal-profile-edit-account");

    return (
        <Modal visible={modal} className="w-full p-6 rounded-xl">
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-end">
                    <Close className="cursor-pointer" onClick={() => setModal(false)} />
                </div>
                <div className="flex flex-col items-center justify-center gap-4">
                    <ProfileEdit
                        profile={profile}
                        input={input}
                        handleInputImage={handleInputImage}
                        errorSize={errorSize}
                        handleUpdate={handleUpdate}
                        setInput={setInput}
                        isEmptyProfile={isEmptyProfile}
                    />
                </div>
            </div>
        </Modal>
    );
};

export default ProfileEditAccountModal;
