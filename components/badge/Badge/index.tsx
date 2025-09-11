import { tw } from "@functions/style";

interface BadgeProps {
    children: React.ReactNode;
    variant?: "default" | "success" | "warning" | "error" | "information";
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
    className?: string;
}

const Badge: React.FC<BadgeProps> = ({ children, className, variant = "default", prefix, suffix }) => {
    const variantClass = {
        default: {
            background: "bg-secondary-20",
            text: "text-secondary-60",
        },
        success: {
            background: "bg-success-20",
            text: "text-success-60",
        },
        information: {
            background: "bg-information-20",
            text: "text-information-60",
        },
        warning: {
            background: "bg-warning-20",
            text: "text-warning-60",
        },
        error: {
            background: "bg-error-20",
            text: "text-error-50",
        },
    };

    return (
        <span
            className={tw(
                "px-2 py-1 font-bold rounded text-small whitespace-nowrap flex items-center w-fit gap-1",
                variantClass[variant].background,
                variantClass[variant].text,
                className
            )}
        >
            {prefix}
            {children}
            {suffix}
        </span>
    );
};

export default Badge;
