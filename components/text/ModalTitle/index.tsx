import { MdClose } from "react-icons/md";

import { tw } from "@functions/style";

import { Title } from "@components/text";

interface Props {
    children: React.ReactNode;
    className?: string;
    parentClassName?: string;
    closeClassName?: string;
    onClose?: () => void;
}

const ModalTitle: React.FC<Props> = ({ children, className, parentClassName, closeClassName, onClose }) => {
    return (
        <div className={tw("flex items-center justify-between gap-8", parentClassName)}>
            <Title size="h5" mSize="large" className={className}>
                {children}
            </Title>
            {onClose && <MdClose title="modal-close" className={tw("cursor-pointer hover:fill-primary-40", closeClassName)} onClick={onClose} />}
        </div>
    );
};

export default ModalTitle;
