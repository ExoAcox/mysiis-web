import { Responsive } from "@components/layout";
import { tw } from "@functions/style";
import { Tab as TabInterface } from "../NavigationBar";

interface TabProps extends TabInterface {
    className?: string;
    tabClassName?: string;
    parentClassName?: string;
}

const Tab: React.FC<TabProps> = ({ onChange, options, value, className, tabClassName, parentClassName }) => {
    return (
        <Responsive
            className={tw("relative flex items-center w-full gap-8 mx-auto", className)}
            parentClassName={tw("flex items-center pt-1 bg-white border-b border-secondary-20", parentClassName)}
        >
            {options.map((option) => {
                const data = typeof option === "object" ? option : { value: option, label: option };
                return (
                    <div
                        key={String(data.value)}
                        onClick={() => {
                            if (value !== data.value) {
                                onChange(data.value, data);
                            }
                        }}
                        className={tw("cursor-pointer text-black-70 pt-1", value === data.value && "font-bold text-black-90", tabClassName)}
                    >
                        {data.label && <label className={"cursor-pointer"}>{data.label}</label>}

                        <div className={tw("w-full h-1 bg-transparent rounded-t-[4px]", value === data.value && "bg-primary-40")} />
                    </div>
                );
            })}
        </Responsive>
    );
}

export default Tab;