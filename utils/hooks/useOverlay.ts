import { useEffect, useState } from "react";

const useOverlay = (selector: string): [boolean, (value: boolean) => void] => {
    const [open, setOpen] = useState(false);
    const [elementClick, setElementClick] = useState(false);

    useEffect(() => {
        const handleClick = (e: Event) => {
            setElementClick((<HTMLElement>e.target)?.closest(selector) ? true : false);
        };

        document.addEventListener("click", handleClick);
        return function cleanup() {
            document.removeEventListener("click", handleClick);
        };
    }, []);

    useEffect(() => {
        if (open && !elementClick) setOpen(false);
    }, [elementClick]);

    return [open, setOpen];
};

export default useOverlay;
