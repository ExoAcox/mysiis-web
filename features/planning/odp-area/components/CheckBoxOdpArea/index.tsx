import React from "react";
import { Else, If, Then, When } from "react-if";

import { tw } from "@functions/style";

import BoxChecked from "@images/vector/box_checked.svg";
import BoxUncheck from "@images/vector/box_uncheck.svg";

interface CheckBoxOdpAreaProps<Value> extends BasicInput {
    value: Value;
    options: (Option<Value> | Value)[];
    onChange: (value: Value) => void;
    disabled?: boolean;
}

export default function CheckBoxOdpArea<Value>({ value, onChange, options, disabled }: CheckBoxOdpAreaProps<Value>) {
    const districtHeatmap = "district-heatmap" as unknown as Value;

    return (
        <div className="relative flex p-1 overflow-hidden rounded-lg shadow-sm gap-y-1">
            <div className={tw("absolute w-full h-full z-10", !disabled && "hidden")} />
            {options.map((option) => {
                const data = (typeof option === "object" ? option : { value: option, label: option }) as Option<Value>;

                return (
                    <div
                        key={String(data.value)}
                        onClick={() => onChange(data.value)}
                        className={tw(
                            "flex items-center gap-2 cursor-pointer w-full p-2 justify-center overflow-hidden rounded-xl",
                            data.value == value ? "bg-[#FFE4E4] text-[#B21F15] font-semibold" : "text-[#313466] bg-"
                        )}
                    >
                        <When condition={data.value === districtHeatmap}>
                            <If condition={data.value === value}>
                                <Then>
                                    <BoxChecked />
                                </Then>
                                <Else>
                                    <BoxUncheck />
                                </Else>
                            </If>
                        </When>
                        <When condition={!!data.label}>
                            <div className={tw(`text-mediu`)}>{data.label}</div>
                        </When>
                    </div>
                );
            })}
        </div>
    );
}
