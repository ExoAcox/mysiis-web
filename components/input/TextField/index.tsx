import { useMemo } from "react";
import { tw } from "@functions/style";

import { LabelInput, ErrorInput } from "@components/text";
export interface TextField extends BasicInput {
    value?: string;
    onChange?: (value: string) => void;
    type?: "text" | "number";
    controller?: object;
    inputClassName?: string;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    onkeyDown?: (value: string) => void;
}

const TextField: React.FC<TextField> = ({
    value,
    onChange,
    label,
    placeholder,
    type,
    className,
    parentClassName,
    inputClassName,
    controller,
    disabled,
    prefix,
    suffix,
    error,
    onkeyDown
}) => {
    const inputProps = { value, placeholder, type, disabled };

    const classNameFinal = useMemo(() => {
        return tw(
            `h-12 border bg-white border-secondary-30 w-full flex gap-3 justify-between items-center p-3 rounded-md`,
            disabled && "bg-secondary-20",
            error && "border-error-50",
            className
        );
    }, [disabled, error, className]);

    return (
        <div className={tw(parentClassName)}>
            <LabelInput className="block">{label}</LabelInput>
            <div className={classNameFinal}>
                {prefix}
                <input
                    className={tw("flex-1 w-full focus:outline-none placeholder:text-black-60-40 text-medium", disabled && "bg-secondary-20", inputClassName)}
                    onChange={(e) => {
                        if (onChange) onChange(e.target.value);
                    }}
                    onKeyDown={(e) => {
                        if (onkeyDown) onkeyDown(e.key);
                    }}
                    {...controller}
                    {...inputProps}
                />
                {suffix}
            </div>
            <ErrorInput error={error} />
        </div>
    );
};

TextField.defaultProps = {
    type: "text",
    disabled: false,
};

export default TextField;
