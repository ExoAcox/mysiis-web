import { tw } from "@functions/style";

interface TabButton<Value> {
    value: Value;
    onChange: (value: Value, data: object) => void;
    options: Option<Value>[];
    className?: string;
    parentClassName?: string;
}

const TabButton = <Value,>({ value, onChange, options, className, parentClassName }: TabButton<Value>) => {
    return (
        <div className={tw(`flex items-stretch`, parentClassName)}>
            {options.map((option) => {
                const data = typeof option === "object" ? option : { value: option, label: option, className: "", disabled: false };

                const classNameFinal = tw(
                    "relative z-[1] text-primary-40 px-4 flex-1 py-2 border bg-white border-primary-40 font-semibold text-medium",
                    "first:rounded-l-lg first:border-r-transparent last:rounded-r-lg",
                    options.length > 2 && "last:border-l-transparent",
                    value === data.value && "text-primary-60 font-bold bg-primary-20 border-primary-60 border-x-primary-40 z-0",
                    className,
                    data.className
                );

                return (
                    <button
                        key={String(data.value)}
                        className={classNameFinal}
                        disabled={data.disabled}
                        type="button"
                        onClick={() => {
                            if (value !== data.value) {
                                onChange(data.value, data);
                            }
                        }}
                    >
                        <span>{data.label}</span>
                        <div className="absolute inset-0 hover:bg-primary-40/5" />
                    </button>
                );
            })}
        </div>
    );
};

export default TabButton;
