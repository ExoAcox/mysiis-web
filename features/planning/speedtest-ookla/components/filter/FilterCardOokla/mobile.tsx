import { useState } from "react";

import { Modal } from "@components/layout";

import { FilterOokla } from "../../card";

import { ModalTitle } from "@components/text";
import { Button } from "@components/button";
import Filter from "@images/vector/filter.svg";

import { Props } from ".";

const FilterCardAgregat: React.FC<Props> = (props) => {
    const [isOpen, setOpen] = useState(false);

    return (
        <>
            <Button className="h-[2.5rem]" onClick={() => setOpen(true)} variant="ghost">
                <Filter/>
                Filter
            </Button>
            <Modal visible={isOpen} className="max-w-[95%]" centered>
                <ModalTitle onClose={() => setOpen(false)} parentClassName="mb-4">
                    Filter
                </ModalTitle>
                <FilterOokla {...props} />
            </Modal>
        </>
    );
};

export default FilterCardAgregat;