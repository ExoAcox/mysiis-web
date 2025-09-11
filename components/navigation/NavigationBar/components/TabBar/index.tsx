import { tw } from "@functions/style";

import { Responsive } from "@components/layout";
import { Tab } from "@components/navigation/NavigationBar";

export interface TabBarProps {
    tab: Tab;
    screenMax?: boolean;
    grandParentClassName?: string;
    parentClassName?: string;
    wrapperClassName?: string;
}

const TabBar: React.FC<TabBarProps> = ({ screenMax, tab, grandParentClassName, parentClassName, wrapperClassName }) => {
    return (
        <Responsive
            className={tw(
                "relative flex items-center w-full gap-8 mx-auto overflow-x-auto md:gap-4 md:scrollbar-hidden",
                screenMax && "max-w-none",
                parentClassName
            )}
            parentClassName={tw("flex items-center h-10 pt-1 bg-white shadow-sm", grandParentClassName)}
        >
            {tab?.options.map((option) => {
                const data = typeof option === "object" ? option : { value: option, label: option };
                return (
                    <div
                        data-testid='option-test'
                        key={String(data.value)}
                        onClick={() => {
                            if (tab.value !== data.value) {
                                tab.onChange(data.value, data);
                            }
                        }}
                        className={tw(
                            `cursor-pointer border-b-4 border-b-transparent text-black-70 py-1 whitespace-nowrap`,
                            tab.value === data.value && "border-b-primary-40 font-bold text-black-90",
                            wrapperClassName
                        )}
                    >
                        {data.label && <label className={"cursor-pointer"}>{data.label}</label>}
                    </div>
                );
            })}
        </Responsive>
    );
};

export default TabBar;
