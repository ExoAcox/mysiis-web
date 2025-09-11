import { useMemo, useState, useEffect } from "react";
import { When } from "react-if";
import dayjs from "dayjs";
import { DateRangePicker as DateRangePicker_ } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";

import useOverlay from "@hooks/useOverlay";

import { tw } from "@functions/style";

import { LabelInput, ErrorInput } from "@components/text";

import CalendarIcon from "@public/images/vector/calendar.svg";

interface DateRangePickerProps extends BasicInput {
    id: string;
    value: { start: string; end: string };
    format?: (start: string, end: string) => string;
    onChange: (start: string, end: string) => void;
    icon?: React.ReactNode;
    position?: Position;
    placeholderClassName?: string;
    panelClassName?: string;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({
    id,
    value,
    format,
    onChange,
    label,
    error,
    position,
    disabled,
    placeholder,
    icon,
    className,
    placeholderClassName,
    parentClassName,
    panelClassName,
}: DateRangePickerProps) => {
    const [isOpen, setOpen] = useOverlay("#" + id);
    const [dateTemp, setDateTemp] = useState<{ start: Date; end: Date }>({ start: dayjs(value.start).toDate(), end: dayjs(value.end).toDate() });

    const verticalPosition = position?.split(" ")[0];
    const horizontalPosition = position?.split(" ")[1];

    const classNameLabel = `bg-white border-secondary-30 w-full flex gap-6 justify-between items-center p-3 cursor-pointer whitespace-nowrap`;

    const classNamePanel = useMemo(() => {
        return tw(
            `absolute z-10 rounded shadow`,
            horizontalPosition === "center" && `left-1/2 -translate-x-1/2`,
            horizontalPosition === "left" && `left-0`,
            horizontalPosition === "right" && `right-0`,
            verticalPosition === "bottom" && `bottom-0 translate-y-full`,
            verticalPosition === "top" && `top-0 -translate-y-full`,
            panelClassName
        );
    }, [position, panelClassName]);

    const classNameFinal = useMemo(() => {
        return tw(
            classNameLabel,
            "h-12 border rounded-md",
            disabled && "border-slate-200 bg-slate-200 cursor-default",
            error && "border-error-50",
            className
        );
    }, [disabled, error, className]);

    useEffect(() => {
        setDateTemp({
            start: dayjs(value.start).toDate(),
            end: dayjs(value.end).toDate(),
        });
    }, [value]);

    return (
        <div className={tw("flex flex-col text-medium", parentClassName)}>
            <LabelInput>{label}</LabelInput>
            <div id={id} className="relative">
                <div className={classNameFinal} onClick={() => !disabled && setOpen(!isOpen)}>
                    <button
                        type="button"
                        className={tw(!value && "text-black-60-40", "max-w-fit", disabled && "cursor-default", placeholderClassName)}
                    >
                        {value ? format && format(value.start, value.end) : placeholder}
                    </button>
                    {icon || <CalendarIcon  title="icon-calendar" />}
                </div>
                <When condition={isOpen}>
                    <div className={classNamePanel}>
                        <DateRangePicker_
                            ranges={[
                                {
                                    startDate: dateTemp.start,
                                    endDate: dateTemp.end,
                                    key: "selection",
                                },
                            ]}
                            showDateDisplay={false}
                            onChange={(e) => {
                                setDateTemp({
                                    start: e.selection.startDate!,
                                    end: e.selection.endDate!,
                                });

                                if (e.selection.startDate !== e.selection.endDate) {
                                    onChange(dayjs(e.selection.startDate).format("YYYY-MM-DD"), dayjs(e.selection.endDate).format("YYYY-MM-DD"));

                                    setOpen(false);
                                }
                            }}
                        />
                    </div>
                </When>
            </div>
            <ErrorInput error={error} />
        </div>
    );
};

DateRangePicker.defaultProps = {
    format: (start, end) => `${dayjs(start).format("DD/MM/YYYY")} - ${dayjs(end).format("DD/MM/YYYY")}`,
    position: "bottom center",
};

export default DateRangePicker;
