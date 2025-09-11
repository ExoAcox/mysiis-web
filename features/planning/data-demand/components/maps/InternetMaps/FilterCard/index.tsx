import { useState, useEffect } from "react";
import { When } from "react-if";

import { useDataInternetStore } from "@features/planning/data-demand/store/internetMaps";
import ComponentsFilterCard from "@features/planning/data-demand/components/maps/InternetMaps/FilterCard/components";

import { Card } from "@components/maps";
import { Title } from "@components/text";

import ArrowDown from "@images/vector/arrow_down.svg";

interface Props {
    access: Access;
}

const FilterCard: React.FC<Props> = ({ access }) => {
    const dataInternet = useDataInternetStore();

    const [isShow, setShow] = useState(true);

    useEffect(() => {
        if (dataInternet.status === "resolve") setShow(true);
    }, [dataInternet.status]);

    if (dataInternet.status !== "resolve") return null;

    return (
        <Card>
            <div
                className="flex items-center justify-between gap-8 cursor-pointer select-none w-full min-w-[30vh] xs:min-w-0"
                onClick={() => setShow(!isShow)}
            >
                <Title size="large" className="text-black-100">
                    Atur Filter
                </Title>
                <ArrowDown className={`mr-1 ${isShow ? "rotate-180" : "translate-y-[1px]"}`} />
            </div>
            <When condition={isShow}>
                <When condition={dataInternet.status === "resolve"}>
                    <div className="mt-2.5">
                        <ComponentsFilterCard access={access} />
                    </div>
                </When>
            </When>
        </Card>
    );
};

export default FilterCard;
