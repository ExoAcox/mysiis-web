import { Card } from "@components/maps";

import { FilterAgregat } from "../../card";

import { Props } from ".";

const FilterCardAgregat: React.FC<Props> = (props) => {
    return (
        <Card className="w-[20.875rem] z-40">
            <FilterAgregat {...props} />
        </Card>
    );
};

export default FilterCardAgregat;
