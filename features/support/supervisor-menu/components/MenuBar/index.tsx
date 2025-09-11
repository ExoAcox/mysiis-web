import { tw } from "@functions/style";

import { Responsive } from "@components/layout";
import { Tab } from "@components/navigation/NavigationBar";

export interface MenuBarProps {
    screenMax?: boolean;
    tab?: Tab;
}

const MenuBar: React.FC<MenuBarProps> = ({ screenMax, tab }) => {
    return (
        <>
            <Responsive
                className={tw("relative flex items-center w-full gap-8 mx-auto", screenMax && "max-w-none")}
                parentClassName="flex items-center h-10 pt-1 bg-white shadow-sm"
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
                                `cursor-pointer border-b-4 border-b-transparent  text-black-70 py-1`,
                                tab.value === data.value && "border-b-primary-40 font-bold text-black-90"
                            )}
                        >
                            {data.label && <label className={"cursor-pointer"}>{data.label}</label>}
                        </div>
                    );
                })}
            </Responsive>
        </>
    );
};

export default MenuBar;
