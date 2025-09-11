import { tw } from "@functions/style";

interface Props {
    options: Option<React.ReactNode>[];
    className?: string;
    parentClassName?: string;
    labelClassName?: string;
    valueClassName?: string;
    emptyValue?: React.ReactNode;
}

const TableList: React.FC<Props> = ({ className, parentClassName, labelClassName, valueClassName, options, emptyValue }) => {
    return (
        <div className={tw("flex flex-col", parentClassName)}>
            {options.map((option) => {
                return (
                    <div key={option.label + "_" + option.value} className={tw("flex gap-2 text-medium", className)}>
                        <span className={labelClassName}>{option.label}</span>
                        <span>:</span>
                        <span className={valueClassName}>{option.value || emptyValue}</span>
                    </div>
                );
            })}
        </div>
    );
};

TableList.defaultProps = {
    emptyValue: "-",
};

export default TableList;
