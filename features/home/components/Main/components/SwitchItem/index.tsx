import { tw } from '@functions/style';

interface SwitchItemProps {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
    isActive: boolean;
}

const SwitchItem: React.FC<SwitchItemProps> = ({ children, onClick, className, isActive }) => {
    const activeClass = "text-success-50";
    const unactiveClass = "text-black-50 bg-[#eeeeee]";

    return (
        <button
            className={tw(
                "h-full aspect-square flex items-center justify-center",
                isActive ? activeClass : unactiveClass,
                className
            )}
            onClick={onClick}>
            {children}
        </button>
    );
}

export default SwitchItem;
