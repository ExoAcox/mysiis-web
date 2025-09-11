import { When } from "react-if";

import useModal from "@hooks/useModal";

import { usePointDescription } from "@features/profile/store";

import { Modal } from "@components/layout";
import { Spinner } from "@components/loader";
import { ModalTitle } from "@components/text";

const PointDescriptionModal = (): JSX.Element => {
    const { modal, setModal } = useModal("modal-profile-point-description");

    const { data, isPending, isSuccess } = usePointDescription();

    return (
        <Modal visible={modal} className="max-w-2xl p-6 w-fit rounded-xl sm:max-w-none">
            <div className="flex flex-col gap-4">
                <ModalTitle onClose={() => setModal(false)} className="text-large">
                    Penjelasan Poin
                </ModalTitle>
                <div className="flex flex-col gap-4 pr-2 max-h-[70vh] overflow-auto">
                    <When condition={isPending}>
                        <Spinner className="w-full h-full" size={70} />
                    </When>
                    <When condition={isSuccess}>
                        <When condition={data && data?.length > 0}>
                            {data?.map((description, index) => (
                                <div key={`${description.key}.${index.toString()}`}>
                                    <List label={description?.label?.id}>{description?.answer?.id}</List>
                                </div>
                            ))}
                        </When>
                    </When>
                </div>
            </div>
        </Modal>
    );
};

const List: React.FC<{ children: React.ReactNode; label: string }> = ({ children, label }) => {
    return (
        <div className="flex flex-col gap-2">
            <span className="text-base font-bold text-black-100">{label}</span>
            <span className="text-sm text-black-80">{children}</span>
        </div>
    );
};

export default PointDescriptionModal;
