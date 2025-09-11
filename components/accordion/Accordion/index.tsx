import { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { Else, If, Then } from "react-if";

import { getBold, getUrl } from "@functions/common";
import { tw } from "@functions/style";

interface Accordion {
    data?: { question: string; answer: string }[];
    keyword?: string;
}

const Accordion: React.FC<Accordion> = ({ data = [], keyword = "" }) => {
    const [indexActive, setIndexActive] = useState<number | null>(null);

    const handleClick = (index: number) => {
        if (index === indexActive) {
            setIndexActive(null);
        } else {
            setIndexActive(index);
        }
    };

    return (
        <div className="flex flex-col gap-4">
            {data?.map((item, index) => (
                <div key={`${index.toString()}`} onClick={() => handleClick(index)} className="overflow-hidden text-black-90">
                    <div
                        className={tw(
                            "flex items-center justify-between gap-16 p-5 rounded-md shadow border cursor-pointer text-lg font-bold bg-white md:gap-4",
                            index === indexActive && "border-b-0 rounded-b-none"
                        )}
                    >
                        <label
                            dangerouslySetInnerHTML={{
                                __html: getBold(getUrl(item?.question), keyword),
                            }}
                            className="accordion-url"
                        ></label>
                        <If condition={index === indexActive}>
                            <Then>
                                <IoIosArrowUp className="shrink-0" />
                            </Then>
                            <Else>
                                <IoIosArrowDown className="shrink-0" />
                            </Else>
                        </If>
                    </div>
                    <div className={tw("p-0 border border-t-0 rounded-b-md text-sm bg-white hidden", index === indexActive && "block")}>
                        <div className="p-5 pt-0 whitespace-pre-line w-[95%]">
                            <label
                                dangerouslySetInnerHTML={{
                                    __html: getBold(getUrl(item?.answer), keyword),
                                }}
                                className="accordion-url"
                            ></label>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

Accordion.defaultProps = {
    keyword: "",
};

export default Accordion;
