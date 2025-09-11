import { useMemo, useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";

import { tw } from "@functions/style";

import { ErrorInput, LabelInput } from "@components/text";

import { TextField } from "../TextField";

const PasswordField: React.FC<TextField> = ({ value, onChange, label, placeholder, className, parentClassName, controller, disabled, error }) => {
    const [isVisible, setVisible] = useState(false);

    const inputProps = { value, placeholder, disabled };

    const classNameFinal = useMemo(() => {
        return tw(
            `border bg-white border-secondary-30 w-full flex gap-0.5 justify-between items-center p-3 rounded-md`,
            disabled && "bg-secondary-20",
            error && "border-error-50",
            className
        );
    }, [disabled, error, className]);

    return (
        <div className={tw("flex flex-col", parentClassName)}>
            <LabelInput>{label}</LabelInput>
            <div className={classNameFinal}>
                <input
                    className={tw("flex-1 focus:outline-none placeholder:text-black-60-40 text-medium", disabled && "bg-secondary-20")}
                    type={isVisible ? "text" : "password"}
                    autoComplete="false"
                    role="presentation"
                    onChange={(e) => {
                        if (onChange) onChange(e.target.value);
                    }}
                    {...controller}
                    {...inputProps}
                />
                <div className="ml-2 cursor-pointer" onClick={() => setVisible(!isVisible)}>
                    {isVisible ? <FaRegEyeSlash /> : <FaRegEye />}
                </div>
            </div>
            <ErrorInput error={error} />
        </div>
    );
};

PasswordField.defaultProps = {
    disabled: false,
};

export default PasswordField;
