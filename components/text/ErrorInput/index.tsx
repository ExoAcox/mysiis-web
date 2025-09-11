import { useMemo } from "react";
import { TiWarningOutline } from "react-icons/ti";

import { tw } from "@functions/style";

interface Props {
    error?: ErrorInput;
    className?: string;
}

const ErrorInput: React.FC<Props> = ({ error, className }) => {
    const errorMessage = useMemo(() => {
        return typeof error === "object" ? (error?.message as string) : error;
    }, [error]);

    if (!error) return null;
    return (
        <span className={tw("flex items-center gap-1 mt-1 text-small text-error-50", className)}>
            <TiWarningOutline /> {errorMessage}
        </span>
    );
};

export default ErrorInput;
