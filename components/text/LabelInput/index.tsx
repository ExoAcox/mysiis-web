import { tw } from "@functions/style";

const LabelInput: React.FC<{ children?: React.ReactNode; className?: string }> = ({ children, className }) => {
    if (!children) return null;
    return <label className={tw("text-small mb-2 font-bold text-black-80", className)}>{children}</label>;
};

export default LabelInput;
