import { useEffect, useState } from "react";

const useMediaQuery = (mobileWidth = 579, options: { debounce?: boolean } = {}): { width: number; isMobile: boolean } => {
    const [width, setWidth] = useState(0);
    const [isMobile, setMobile] = useState(false);

    const { debounce = true } = options;

    let debounceInstance: NodeJS.Timeout;

    useEffect(() => {
        const event = () => {
            setWidth(window.innerWidth);
            setMobile(window.innerWidth <= mobileWidth);
        };

        const handleResize = () => {
            event();

            if (debounce) {
                clearTimeout(debounceInstance);
                debounceInstance = setTimeout(() => {
                    event();
                }, 1000);
            }
        };

        event();

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return { width, isMobile };
};

export default useMediaQuery;
