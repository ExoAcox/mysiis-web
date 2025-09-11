import { useState } from "react";
import { When } from "react-if";

import ArrowDown from "@images/vector/arrow_down.svg";

import ComponentsFilterCard from "@features/planning/data-demand/components/maps/FilterCard/components";

import { Card } from "@components/maps";
import { Title } from "@components/text";

interface Props {
    access: Access;
}

const FilterCard: React.FC<Props> = ({ access }) => {
    const [isShow, setShow] = useState(true);

    return (
        <Card>
            <div
                className="flex items-center justify-between gap-4 cursor-pointer select-none w-full min-w-[30vh] xs:min-w-0"
                onClick={() => setShow(!isShow)}
            >
                <Title size="large" className="text-black-100">
                    Atur Filter
                </Title>
                <ArrowDown className={`mr-1 ${isShow ? "rotate-180" : "translate-y-[1px]"}`} />
            </div>
            <When condition={isShow}>
                <div className="mt-2.5">
                    <ComponentsFilterCard access={access} />
                </div>
            </When>
        </Card>
    );
};

export default FilterCard;
