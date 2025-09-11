import { Card } from "@components/maps";

import { SourceButton, PortList, FilterCheckbox, Radius } from "./components";

import { Props } from ".";

const FilterCard: React.FC<Props> = (props) => {
    return (
        <Card>
            <SourceButton {...props} />
            <FilterCheckbox {...props} />
            <Radius access={props.access} />
            <PortList />
        </Card>
    );
};

export default FilterCard;
