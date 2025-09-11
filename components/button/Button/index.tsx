import colors from "@styles/theme/colors.json";
import { useMemo } from "react";
import useRipple from "use-ripple-hook";

import { tw } from "@functions/style";

import { Spinner } from "@components/loader";

interface Button {
    children?: React.ReactNode;
    onClick?: React.MouseEventHandler;
    color?: "primary" | "secondary";
    variant?: "filled" | "ghost" | "nude";
    type?: "button" | "submit";
    rippleColor?: string;
    hoverColor?: string;
    className?: string;
    labelClassName?: string;
    loading?: boolean;
    disabled?: boolean;
}

const getColor = (color: string) => {
    if (color === "primary") {
        return "text-primary-40 bg-primary-40 border-primary-40";
    } else {
        return "text-secondary-50 bg-black-60 border-secondary-30";
    }
};

const getVariant = (variant: string) => {
    switch (variant) {
        case "ghost":
            return `bg-white`;
        case "nude":
            return `bg-transparent border-transparent`;
        default:
            return `text-white`;
    }
};

const Button: React.FC<Button> = ({
    children,
    onClick,
    color,
    variant,
    type,
    rippleColor,
    hoverColor,
    className,
    labelClassName,
    loading,
    disabled,
}) => {
    const [buttonRef, event] = useRipple({ color: rippleColor || "rgba(0, 0, 0, 0.1)", disabled: variant === "nude" });

    const buttonProps = { onClick, type };

    const classNameFinal = useMemo(
        () =>
            tw(
                `flex group items-center justify-center gap-2 whitespace-nowrap relative rounded-lg border w-fit h-fit px-3 py-2 font-bold`,
                getColor(color!),
                getVariant(variant!),
                disabled && `disabled:opacity-50`,
                className
            ),
        [className, disabled, color, variant]
    );

    const hoverColorFinal = useMemo(() => {
        if (hoverColor) return hoverColor;

        if (variant === "filled" || color === "secondary") {
            return "bg-black/5";
        } else {
            return "bg-primary-40/5";
        }
    }, [hoverColor, color, variant]);

    return (
        <button
            data-testid="button-test"
            className={classNameFinal}
            ref={buttonRef}
            onMouseDown={event}
            disabled={loading || disabled}
            {...buttonProps}
        >
            <div className={tw("flex items-center gap-1", loading && "opacity-0", labelClassName)}>{children}</div>
            {loading && (
                <Spinner
                    color={variant === "filled" ? "#fff" : color === "primary" ? colors["primary-40"] : colors["secondary-60"]}
                    className="absolute -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"
                    size={buttonRef.current?.offsetHeight ? (buttonRef.current?.offsetHeight / 10) * 6 : undefined}
                />
            )}
            <div
                className={tw(
                    "absolute invisible left-0 top-0 w-full h-full group-hover:visible",
                    disabled && "group-hover:invisible",
                    hoverColorFinal
                )}
            />
        </button>
    );
};

Button.defaultProps = {
    color: "primary",
    variant: "filled",
    type: "button",
    loading: false,
    disabled: false,
};

export default Button;
