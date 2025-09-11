import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

import { tw } from "@functions/style";

interface Props {
    visible: boolean;
    children: ReactNode;
    loading?: boolean;
    centered?: boolean;
    onClose?: () => void;
    className?: string;
    parentClassName?: string;
    onBackgroundClick?: () => void;
}

const Modal = ({ visible, children, loading, centered, onClose, className, parentClassName, onBackgroundClick }: Props) => {
    const [isClient, setClient] = useState(false);
    const [shouldRender, setRender] = useState(visible);

    useEffect(() => {
        if (visible) {
            setRender(true);
        }
    }, [visible]);

    const onTransitionEnd = () => {
        if (!visible) {
            setRender(false);
            if (onClose) onClose();
        }
    };

    const parentClassNameFinal = tw("modal", centered && "modal-center", parentClassName);
    const classNameFinal = tw(visible ? "opacity-100 scale-100" : "opacity-0 scale-80", className);

    useEffect(() => {
        setClient(true);
    }, []);

    if (!isClient) return null;
    if (!shouldRender) return null;

    return createPortal(
        <div
            className={parentClassNameFinal}
            onClick={() => {
                if (onBackgroundClick) onBackgroundClick();
            }}
            data-testid="modal"
        >
            {loading && <div className="progress-bar" />}
            <div className={classNameFinal} onTransitionEnd={onTransitionEnd}>
                {children}
            </div>
        </div>,
        document.getElementById("__modal")!
    );
};

export default Modal;
