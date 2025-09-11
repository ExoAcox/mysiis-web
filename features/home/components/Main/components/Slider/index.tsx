import { useContext, useDeferredValue, useEffect, useState } from "react";
import { ScrollMenu, VisibilityContext } from "react-horizontal-scrolling-menu";
import { When } from "react-if";

import usePortofolio from "@hooks/usePortofolio";

import { intersection } from "@functions/common";

import ArrowIcon from "@images/vector/arrow.svg";

import { Button } from "@components/button";
import { Title } from "@components/text";

import { GridCard } from "../index";

const Slider: React.FC<{ user: User; category: Portofolio["category"] }> = ({ user, category }) => {
    const portofolios = usePortofolio({ category });
    const activePortofolios = portofolios.filter((portofolio) => {
        const active = portofolio.guest || intersection(user.permission_keys, [...portofolio.permission, "development"]).length;
        return active;
    });

    return (
        <When condition={activePortofolios.length}>
            <div>
                <Title size="h4" className="capitalize text-black-80 pb-[0.375rem]">
                    {category}
                </Title>
                <div className="relative">
                    <ScrollMenu
                        scrollContainerClassName="flex gap-3 py-2 px-2 scrollbar-hidden md:scrollbar-visible-block"
                        LeftArrow={LeftArrow}
                        RightArrow={RightArrow}
                    >
                        {activePortofolios.map((portofolio) => {
                            return <GridCard portofolio={portofolio} key={portofolio.path} user={user} />;
                        })}
                    </ScrollMenu>
                </div>
            </div>
        </When>
    );
};

const arrowClass = "py-4.5 px-4 absolute top-1/2 z-[2] -translate-y-1/2 disabled:border-secondary-30 disabled:bg-secondary-20 disabled:opacity-100";

const LeftArrow = () => {
    const { isFirstItemVisible, scrollPrev } = useContext(VisibilityContext);
    const [isShowing, setShowing] = useState(false);

    useEffect(() => {
        const delay = setTimeout(() => {
            setShowing(!isFirstItemVisible);
        }, 500);

        return () => clearTimeout(delay);
    }, [isFirstItemVisible]);

    return (
        <When condition={isShowing}>
            <div className="md:hidden">
                <Button
                    variant="ghost"
                    className={arrowClass + " -left-1 -translate-x-full"}
                    onClick={() => scrollPrev()}
                    disabled={isFirstItemVisible}
                >
                    <ArrowIcon className="rotate-180" />
                </Button>
                <div className="absolute top-0 left-0 z-[2] h-full py-2">
                    <div className="w-[4.375rem] h-full bg-gradient-to-l from-white/0 to-background" />
                </div>
            </div>
        </When>
    );
};

const RightArrow = () => {
    const { isLastItemVisible, scrollNext } = useContext(VisibilityContext);
    const [isShowing, setShowing] = useState(false);

    useEffect(() => {
        const delay = setTimeout(() => {
            setShowing(!isLastItemVisible);
        }, 500);

        return () => clearTimeout(delay);
    }, [isLastItemVisible]);

    return (
        <When condition={isShowing}>
            <div className="md:hidden">
                <Button
                    variant="ghost"
                    className={arrowClass + " -right-1 translate-x-full"}
                    onClick={() => scrollNext()}
                    disabled={isLastItemVisible}
                >
                    <ArrowIcon />
                </Button>
                <div className="absolute top-0 right-0 z-[2] h-full py-2">
                    <div className="w-[4.375rem] h-full bg-gradient-to-r from-white/0 to-background" />
                </div>
            </div>
        </When>
    );
};

export default Slider;
