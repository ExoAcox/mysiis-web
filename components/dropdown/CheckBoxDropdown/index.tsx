import { useMemo } from "react";
import { When } from "react-if";

import useOverlay from "@hooks/useOverlay";

import { tw } from "@functions/style";

import ArrowDown from "@images/vector/arrow_down.svg";
import BoxChecked from "@images/vector/box_checked.svg";
import BoxUncheck from "@images/vector/box_uncheck.svg";

import { LabelInput, ErrorInput } from "@components/text";

interface CheckBoxDropdownProps<Value> extends BasicInput {
    id: string;
    value: Value[];
    onChange: (value: Value[], data: object) => void;
    options: Option<Value>[];
    placeholderClassName?: string;
    parentClassName?: string;
}

const CheckBoxDropdown = <Value,>({
    id,
    value,
    onChange,
    options,
    label,
    error,
    disabled,
    placeholder,
    className,
    placeholderClassName,
    parentClassName,
}: CheckBoxDropdownProps<Value>) => {
    const [isOpen, setOpen] = useOverlay("#" + id);

    const handleClick = (data: Option<Value>) => {
        const newValue = [...value];
        const index = newValue.findIndex((value) => value === data.value);

        if (index >= 0) {
            newValue.splice(index, 1);
        } else {
            newValue.push(data.value);
        }

        onChange(newValue, data);
    };

    const classNameLabel = `bg-white border-secondary-30 w-full flex gap-6 justify-between items-center p-3 cursor-pointer whitespace-nowrap`;
    const classNameFinal = useMemo(() => {
        return tw(
            classNameLabel,
            "border rounded-md",
            disabled && "border-secondary-20 bg-secondary-20 cursor-default",
            error && "border-error-60",
            className
        );
    }, [disabled, error, className]);

    const formattedOptions = useMemo(() => {
        return options.map((option) => {
            if (typeof option === "object") {
                return option;
            } else {
                return { label: option, value: option, className: "" };
            }
        });
    }, [options]);

    return (
        <div className={tw("flex flex-col text-medium", parentClassName)}>
            <LabelInput>{label}</LabelInput>
            <div id={id} className="relative">
                <div className={classNameFinal} onClick={() => !disabled && setOpen(!isOpen)}>
                    <button type="button" className={tw(!value && "text-black-60-40", disabled && "text-secondary-40 cursor-default", placeholderClassName)}>
                        {placeholder}
                    </button>
                    <ArrowDown className={tw(isOpen ? "rotate-180" : "translate-y-[1px]", disabled && "cursor-default")} />
                </div>
                <When condition={isOpen}>
                    <div className="absolute bottom-0 z-10 flex flex-col max-h-[16.875rem] rounded overflow-auto min-w-full -translate-x-1/2 translate-y-full shadow left-1/2">
                        <div>
                            {formattedOptions.map((option) => {
                                return (
                                    <button
                                        type="button"
                                        key={String(option.value)}
                                        className={tw(classNameLabel, option.className)}
                                        onClick={() => {
                                            handleClick(option);
                                        }}
                                    >
                                        <span>{option.label}</span>
                                        {value.includes(option.value) ? <BoxChecked /> : <BoxUncheck />}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </When>
            </div>
            <ErrorInput error={error} />
        </div>
    );
};

export default CheckBoxDropdown;
