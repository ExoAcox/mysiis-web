import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { MdDragHandle } from "react-icons/md";
import { useSwipeable } from "react-swipeable";

export interface BottomSheetProps {
    open?: boolean;
    children: React.ReactNode;
    defaultSnap?: number | "max";
    snapPoints?: (snap: { minHeight: number; maxHeight: number }) => number[];
}

export interface SheetRef {
    snapTo: (value: number | "max") => void;
}

// eslint-disable-next-line react/display-name
const BottomSheet = forwardRef<SheetRef, BottomSheetProps>(({ open = true, children, defaultSnap }, ref) => {
    const sheetRef = useRef<HTMLDivElement>();
    const [isReady, setReady] = useState(false);

    const [currentPosition, setCurrentPosition] = useState(0);
    const [lastPosition, setLastPosition] = useState(0);

    const refPassthrough = (el: HTMLDivElement) => {
        handlers.ref(el);
        sheetRef.current = el;
    };

    useEffect(() => {
        setReady(true);
    }, []);

    useEffect(() => {
        if (open && sheetRef.current) {
            let position = defaultSnap ?? 0;
            if (position === "max") position = sheetRef.current.clientHeight - 24;
            setCurrentPosition(position);
            setLastPosition(position);
        }
    }, [open, sheetRef.current]);

    useImperativeHandle(ref, () => ({
        snapTo(value: number | "max") {
            if (sheetRef.current) {
                sheetRef.current.style.transition = "0.5s";

                let position = value ?? 0;
                if (position === "max") position = sheetRef.current.clientHeight - 24;
                setCurrentPosition(position);
                setLastPosition(position);
            }
        },
    }));

    const handlers = useSwipeable({
        onSwiping: (event) => {
            const maxHeight = sheetRef.current!.clientHeight - 24;

            if (event.dir === "Up") {
                let value = lastPosition + event.absY;
                if (value <= 0) value = 0;
                if (value >= maxHeight) value = maxHeight;
                if (event.velocity >= 1) {
                    sheetRef.current!.style.transition = "0.5s";
                    value = maxHeight;
                }
                setCurrentPosition(value);
            }

            if (event.dir === "Down") {
                let value = lastPosition - event.absY;
                if (value <= 0) value = 0;
                if (value >= maxHeight) value = maxHeight;
                if (event.velocity >= 1) {
                    sheetRef.current!.style.transition = "0.5s";
                    value = 0;
                }
                setCurrentPosition(value);
            }
        },
        onSwiped: (event) => {
            const maxHeight = sheetRef.current!.clientHeight - 24;

            if (event.dir === "Up") {
                let value = lastPosition + event.absY;
                if (value <= 0) value = 0;
                if (value >= maxHeight) value = maxHeight;
                if (event.velocity >= 1) {
                    sheetRef.current!.style.transition = "0.5s";
                    value = maxHeight;
                }
                setLastPosition(value);
            }

            if (event.dir === "Down") {
                let value = lastPosition - event.absY;
                if (value <= 0) value = 0;
                if (value >= maxHeight) value = maxHeight;
                if (event.velocity >= 1) {
                    sheetRef.current!.style.transition = "0.5s";
                    value = 0;
                }
                setLastPosition(value);
            }
        },
        trackMouse: true,
        preventScrollOnSwipe: true,
    });

    if (!isReady || !open) return null;

    return createPortal(
        <div
            {...handlers}
            ref={refPassthrough}
            className="transform-gpu fixed w-full shadow-lg rounded-t-lg bottom-0 pb-1 z-50 bg-white overflow-auto max-h-screen translate-y-[calc(100%-24px)]"
            style={{ bottom: currentPosition }}
            onTransitionEnd={() => {
                sheetRef.current!.style.transition = "0s";
            }}
            data-testid="bottom-sheet"
        >
            <div {...handlers} className="sticky top-0 w-full bg-white cursor-grab">
                <MdDragHandle className="w-6 h-6 mx-auto" />
            </div>
            {children}
        </div>,
        document.getElementById("__modal")!
    );
});

BottomSheet.defaultProps = {
    defaultSnap: 0,
    snapPoints: ({ minHeight, maxHeight }) => [20, minHeight, (maxHeight / 10) * 7],
};

export default BottomSheet;
