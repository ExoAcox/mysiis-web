import useModal from "@hooks/useModal";

import { Modal } from "@components/layout";
import { ModalTitle } from "@components/text";

import { PointHistory } from "@features/profile/components/Point/components";

const PointHistoryModal = (): JSX.Element => {
    const { modal, setModal } = useModal("modal-profile-point-history");

    return (
        <Modal visible={modal} className="w-fit min-w-[21rem] max-w-[30rem] p-6 rounded-xl md:w-full md:min-w-0 md:max-w-none">
            <div className="flex flex-col gap-4">
                <ModalTitle onClose={() => setModal(false)} className="text-large">
                    {""}
                </ModalTitle>
                <div className="flex flex-col w-full max-h-[70vh] overflow-auto">
                    <PointHistory />
                </div>
            </div>
        </Modal>
    );
};

export default PointHistoryModal;
