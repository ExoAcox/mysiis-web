import { useState } from "react";

import { Modal } from "@components/layout";

import { SourceButton, PortList, FilterCheckbox, Radius } from "./components";

import { ModalTitle } from "@components/text";
import { Button } from "@components/button";

import { Props } from ".";

const FilterCard: React.FC<Props> = (props) => {
    const [isOpen, setOpen] = useState(false);

    return (
        <>
            <Button className="h-[2.5rem]" onClick={() => setOpen(true)} variant="ghost">
                Filter
            </Button>
            <Modal visible={isOpen} className="max-w-[95%]" centered>
                <ModalTitle onClose={() => setOpen(false)} parentClassName="mb-4">
                    Filter
                </ModalTitle>
                <SourceButton {...props} />
                <FilterCheckbox {...props} />
                <Radius access={props.access} />
                <PortList />
            </Modal>
        </>
    );
};

export default FilterCard;
