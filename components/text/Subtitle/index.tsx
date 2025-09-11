import { tw, getFontSize } from "@functions/style";

interface Props {
    children: React.ReactNode;
    className?: string;
    size?: Size;
    mSize?: Size;
}

const Subtitle: React.FC<Props> = ({ children, size, mSize = size, className }) => {
    return <p className={tw("text-black-90 inline-block", getFontSize(size!), getFontSize(mSize!, "md:"), className)}>{children}</p>;
};

Subtitle.defaultProps = {
    size: "medium",
};

export default Subtitle;
