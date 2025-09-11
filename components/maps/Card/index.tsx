import { tw } from "@functions/style";

interface Props {
    children: React.ReactNode;
    className?: string;
}

const MapsCard: React.FC<Props> = ({ children, className }) => {
    return <div className={tw("p-4 bg-white rounded-lg shadow", className)}>{children}</div>;
};

export default MapsCard;
