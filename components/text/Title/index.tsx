import { tw, getFontSize } from "@functions/style";

interface Props {
    children: React.ReactNode;
    tag?: Size | "span";
    size?: Size;
    mSize?: Size;
    className?: string;
}

const getTag = (tag: Props["tag"]) => {
    const tags = ["h1", "h2", "h3", "h4", "h5", "span"];
    return tags.includes(tag!) ? tag : "span";
};

const Title: React.FC<Props> = ({ children, size, mSize = size, tag = size, className }) => {
    const HeaderTag = `${getTag(tag)}` as keyof JSX.IntrinsicElements;

    return (
        <HeaderTag className={tw("block font-bold text-black-90", getFontSize(size!), getFontSize(mSize!, "md:"), className)}>{children}</HeaderTag>
    );
};

Title.defaultProps = {
    size: "h3",
};

export default Title;
