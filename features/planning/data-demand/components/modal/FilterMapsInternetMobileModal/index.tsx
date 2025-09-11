import useModal from "@hooks/useModal";

import ComponentsFilterCard from "@features/planning/data-demand/components/maps/InternetMaps/FilterCard/components";

import { Button } from "@components/button";
import { Modal } from "@components/layout";
import { ModalTitle } from "@components/text";

interface Props {
    access: Access;
}

const FilterMapsInternetMobileModal = ({ access }: Props): JSX.Element => {
    const { modal, setModal } = useModal("modal-data-demand-maps-internet-filter-mobile");

    return (
        <Modal visible={modal} className="p-6 w-fit rounded-xl">
            <div className="flex flex-col gap-4">
                <ModalTitle onClose={() => setModal(false)} className="text-large">
                    Filter
                </ModalTitle>
                <div className="flex flex-col">
                    <ComponentsFilterCard access={access} />
                </div>
                <Button onClick={() => setModal(false)} className="w-full my-2">
                    Terapkan
                </Button>
            </div>
        </Modal>
    );
};

export default FilterMapsInternetMobileModal;
