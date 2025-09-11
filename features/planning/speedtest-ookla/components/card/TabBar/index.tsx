import { tw } from "@functions/style";
import { Tab } from "@components/navigation/NavigationBar";

export interface TabBarProps {
    tab: Tab;
    screenMax?: boolean;
}

const TabBar: React.FC<TabBarProps> = ({ screenMax, tab }) => {
    return (
        <div
            className={tw("relative flex justify-center items-center w-full gap-4 mx-auto overflow-x-auto md:gap-4 md:scrollbar-hidden", 
            screenMax && "max-w-none")}
        >
            {tab?.options.map((option) => {
                const data = typeof option === "object" ? option : { value: option, label: option };
                return (
                    <div
                        key={String(data.value)}
                        onClick={() => {
                            if (tab.value !== data.value) {
                                tab.onChange(data.value, data);
                            }
                        }}
                        className={tw(
                            `cursor-pointer border-b-4 border-b-transparent text-black-70 py-1 whitespace-nowrap`,
                            tab.value === data.value && "border-b-primary-40 font-bold text-black-90"
                        )}
                    >
                        {data.label && <label className={"cursor-pointer"}>{data.label}</label>}
                    </div>
                );
            })}
        </div>
    );
};

export default TabBar;
