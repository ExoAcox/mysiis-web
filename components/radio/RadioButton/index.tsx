import { useMemo } from "react";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

import { FaDotCircle, FaRegCircle } from "react-icons/fa";

import { LabelInput, ErrorInput } from "@components/text";

interface RadioButtonProps<Value> extends BasicInput {
    value: Value;
    options: Option<Value>[];
    onChange: (value: Value, data: object) => void;
}

const RadioButton = <Value,>({ value, onChange, options, label, className, disabled, error }: RadioButtonProps<Value>) => {
    const classNameFinal = useMemo(() => {
        return clsx(
            `w-fit h-fit flex gap-2 justify-start items-center px-2 cursor-pointer`,
            disabled && "text-slate-200 cursor-default",
            error && "text-primary-40",
            className
        );
    }, [disabled, error, className]);

    return (
        <div className="flex flex-col">
            <LabelInput>{label}</LabelInput>
            <div className="space-y-1">
                {options.map((option) => {
                    const data = typeof option === "object" ? option : { value: option, label: option };

                    return (
                        <div
                            key={String(data.value)}
                            onClick={() => {
                                if (value !== data.value) {
                                    onChange(data.value, data);
                                }
                            }}
                            className={twMerge(classNameFinal)}
                        >
                            {value === data.value ? <FaDotCircle /> : <FaRegCircle />}
                            {data.label && <label className={`text-sm ${!disabled ? "cursor-pointer" : ""}`}>{data.label}</label>}
                        </div>
                    );
                })}
            </div>
            <ErrorInput error={error} />
        </div>
    );
};

RadioButton.defaultProps = {
    disabled: false,
};

export default RadioButton;
