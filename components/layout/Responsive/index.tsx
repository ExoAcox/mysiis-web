import { tw } from "@functions/style";

interface Props {
    children: React.ReactNode;
    className?: string;
    parentClassName?: string;
}

const Responsive: React.FC<Props> = ({ children, className, parentClassName }) => {
    return (
        <div className={tw("relative", parentClassName)}>
            <div className={tw("mx-auto px-8 sm:px-4 md:px-6 max-w-default", className)}>{children}</div>
        </div>
    );
};

export default Responsive;
