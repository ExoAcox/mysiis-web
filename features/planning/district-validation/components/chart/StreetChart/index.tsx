import dayjs from "dayjs";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { MissingStreet } from "@api/district/metadata";

import BarChart from "@features/planning/district-validation/components/chart/BarChart";

import { DateRangePicker } from "@components/calendar";

interface Props {
    filter: MissingStreet;
    setFilter: Dispatch<SetStateAction<MissingStreet>>;
}

type Datetemp = { startDate: string; endDate: string };

const StreetChart = ({ filter, setFilter }: Props) => {
    const [dateTemp, setDateTemp] = useState<Datetemp>({ startDate: "", endDate: "" });

    useEffect(() => {
        setDateTemp({
            startDate: String(dayjs(filter.start_date).toDate()),
            endDate: String(dayjs(filter.end_date).toDate()),
        });
    }, [filter.start_date, filter.end_date]);

    return (
        <section className="my-8">
            <div className="flex justify-between mb-4">
                <h3 className="font-extrabold">Summary Missing Street Data</h3>

                <DateRangePicker
                    id="speedtest-date"
                    value={{ start: dateTemp.startDate, end: dateTemp.endDate }}
                    onChange={(date, nextDate) => {
                        setFilter({
                            ...filter,
                            page: 1,
                            start_date: date,
                            end_date: nextDate,
                        });
                    }}
                    parentClassName="h-[42px]"
                />
            </div>
            <BarChart filter={filter} />
        </section>
    );
};

export default StreetChart;
