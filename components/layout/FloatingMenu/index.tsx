import { twMerge } from "tailwind-merge";

interface Props {
    children: React.ReactNode;
    className?: string;
}

const FloatingMenu: React.FC<Props> = ({ children, className }) => {
    return (
        <div
            className={twMerge(
                `flex flex-col gap-3 absolute z-[2] left-0 top-0 h-full p-3 pointer-events-through overflow-y-auto scrollbar-flip ${className}`
            )}
        >
            {children}
        </div>
    );
};

export default FloatingMenu;
