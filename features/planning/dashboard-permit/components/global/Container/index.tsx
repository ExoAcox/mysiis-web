import { tw } from "@functions/style";

interface Props {
    children: React.ReactNode;
    className?: string;
}

const Container: React.FC<Props> = ({ children, className }) => {
    return <div className={tw("bg-white p-6 rounded-md shadow", className)}>{children}</div>;
};

export default Container;
