import IconPrioritas1 from "@public/images/vector/icon-prioritas-1.svg";
import React, { useState } from "react";
import { When } from "react-if";

import { tw } from "@functions/style";

import ArrowDown from "@images/vector/arrow_down.svg";

import { menuTemplate } from "@features/planning/mysiista/function";
import { handlePriority } from "@features/planning/mysiista/function/drawing";

import { Title } from "@components/text";

interface PropertyState {
    label: string;
    icon: React.ElementType;
    color: string;
    value: string;
    priority: number;
}
const Dropdown = () => {
    const [property, setProperty] = useState<PropertyState>({
        label: "Prioritas 1",
        icon: IconPrioritas1,
        color: "#D12030",
        value: "prioritas-1",
        priority: 1,
    });

    const [active, setActive] = useState(false);

    const handleBtn = (item: PropertyState) => {
        setActive(false);
        handlePriority(item.value, item.priority);
        setProperty(item);
    };

    return (
        <div className="relative">
            <button
                data-testid="btn-test-dropdown"
                onClick={() => setActive(!active)}
                className="flex items-center justify-between p-[12px] w-full border border-[#C8CACD] rounded-md overflow-hidden mt-2 bg-white"
            >
                <Title size="medium" className="text-[14px] text-[#262829] font-normal flex gap-[16px]">
                    <property.icon className="text-2xl" />
                    {property.label}
                </Title>
                <ArrowDown className={tw("text-[10px] transition", active ? "rotate-180" : "rotate-0")} />
            </button>
            <When condition={active}>
                <div className="flex flex-col border border-[#C8CACD] shadow rounded-md overflow-hidden z-10 bg-white absolute top-[85px] w-full">
                    {menuTemplate.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <button
                                data-testid="btn-prioritas"
                                className={tw(
                                    "flex items-center gap-[16px] text-[14px] text-[#262829] font-normal cursor-pointer h-[42px] p-3 bg-white",
                                    index + 1 != menuTemplate.length ? "border-b border-b-[#C8CACD]" : ""
                                )}
                                key={`${item.value}.${index.toString()}`}
                                onClick={() => handleBtn(item)}
                            >
                                <Icon className="text-2xl" /> <span>{item.label}</span>
                            </button>
                        );
                    })}
                </div>
            </When>
        </div>
    );
};

export default Dropdown;
