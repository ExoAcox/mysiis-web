import React, { createContext } from "react";
import { vi } from "vitest";

interface Props {
    children: React.ReactNode;
    LeftArrow: React.FC;
    RightArrow: React.FC;
}

export const ScrollMenu: React.FC<Props> = ({ children, LeftArrow, RightArrow }) => {
    return (
        <div>
            <LeftArrow />
            {children}
            <RightArrow />
        </div>
    );
};

export const VisibilityContext = createContext({
    scrollPrev: vi.fn(),
    scrollNext: vi.fn(),
});
