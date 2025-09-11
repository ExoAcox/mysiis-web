import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Else, If, Then, Unless, When } from "react-if";

import { getRegional } from "@api/district/network";
import { GetRespondentByWitel, RespondentByWitel, getRespondentByWitel } from "@api/survey-demand/respondent";

import useModal from "@hooks/useModal";
import useOverlay from "@hooks/useOverlay";

import { errorHelper } from "@functions/common";

import Calendar from "@images/vector/calendar.svg";
import Filter from "@images/vector/filter.svg";

import { LineChart } from "@features/planning/data-demand/components/chart";
import { colorPicker, getDaysArray, hexToRgbA } from "@features/planning/data-demand/functions/chart";

import { Button } from "@components/button";
import { Dropdown } from "@components/dropdown";
import { Spinner } from "@components/loader";
import { LabelInput } from "@components/text";

import { FilterChartMobileModal } from "../../modal";

export interface ListDataResponses {
    color: string;
    data: RespondentByWitel[];
    rgba: string;
    status: boolean;
    witel: string;
}

interface Props {
    user: User;
}

const MainChart = ({ user }: Props) => {
    const date = new Date();
    const id = "filter-data-demand-chart-date";
    const chartRef = useRef(null);

    const [input, setInput] = useState<GetRespondentByWitel>({
        survey_at_start: dayjs(date).subtract(1, "months").format("YYYY-MM-DD"),
        survey_at_end: dayjs(date).format("YYYY-MM-DD"),
        treg: "Regional 1",
    });
    const [listData, setListData] = useState<ListDataResponses[]>([]);
    const [periodDate, setPeriodDate] = useState<Date[]>([]);
    const [isLoading, setLoading] = useState(false);
    const [listRegional, setListRegional] = useState<Option<string>[]>([{ label: "Regional 1", value: "Regional 1" }]);
    const [isOpen, setOpen] = useOverlay("#" + id);
    const [dateTemp, setDateTemp] = useState<{ startDate?: Date; endDate?: Date }>({});
    const [legend, setLegend] = useState<ListDataResponses[]>([]);
    const [chart, setChart] = useState<ListDataResponses[]>([]);
    const [activeCount, setActiveCount] = useState<number>(0);

    const modalFilterChartMobile = useModal("modal-data-demand-chart-filter-mobile");

    const fetchRegional = () => {
        getRegional()
            .then((result) => {
                setListRegional(result.map((treg) => ({ label: treg, value: treg })));
            })
            .catch((error) => {
                errorHelper(error);
            });
    };

    const fetchListData = () => {
        setLoading(true);
        setListData([]);
        setPeriodDate([]);
        getRespondentByWitel(input)
            .then((result) => {
                const range = getDaysArray(input.survey_at_start!, input.survey_at_end!);
                const rangeFormatted = range.map((item) => dayjs(item).format("YYYY-MM-DD"));
                const listDataRespons: ListDataResponses[] = [];

                result.forEach((data, index: number) => {
                    const rangeData = data.items.map((item) => item.periode_date);
                    const rangeDataFiltered = rangeFormatted.filter((item) => !rangeData.includes(item));

                    rangeDataFiltered.forEach((item) =>
                        data.items.push({
                            treg: input.treg?.toUpperCase(),
                            witel: data.witel,
                            periode_date: item,
                            status: "valid",
                            total: null,
                        })
                    );

                    const color = colorPicker(index);
                    const list = data.items.sort(function (a, b) {
                        return Number(new Date(a.periode_date!)) - Number(new Date(b.periode_date!));
                    });

                    listDataRespons.push({
                        witel: data.witel,
                        data: list,
                        color: color,
                        rgba: hexToRgbA(color),
                        status: true,
                    });
                });

                setListData(listDataRespons);
                setPeriodDate(range);
            })
            .catch((error) => {
                errorHelper(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        if (!user.regional || user.regional === "National" || Array.isArray(user.regional)) {
            fetchRegional();
        }

        if (user.regional && user.regional !== "National" && !Array.isArray(user.regional)) {
            setListRegional([{ label: user.regional, value: user.regional }]);
            setInput({ ...input, treg: user.regional });
        }
    }, [user]);

    useEffect(() => {
        fetchListData();
    }, [input]);

    useEffect(() => {
        setDateTemp({
            startDate: dayjs(input.survey_at_start).toDate(),
            endDate: dayjs(input.survey_at_end).toDate(),
        });
    }, [input]);

    useEffect(() => {
        setActiveCount(0);
        if (input) {
            if (input?.treg) setActiveCount((count) => ++count);
            if (input?.survey_at_start) setActiveCount((count) => ++count);
        }
    }, [input]);

    useEffect(() => {
        setChart(listData);
        setLegend(listData);
    }, [listData]);

    return (
        <div className="w-full h-full my-8">
            <div className="flex flex-col gap-8 overflow-auto">
                <div className="flex flex-wrap items-center justify-start gap-4 md:flex-col md:items-start md:justify-center">
                    <Button
                        onClick={() => modalFilterChartMobile.setModal(true)}
                        className="hidden py-2.5 text-sm w-fit md:flex"
                        labelClassName="gap-2"
                        variant="ghost"
                    >
                        <If condition={activeCount}>
                            <Then>
                                <span className="px-2 py-1 rounded-full bg-primary-40 text-background">{activeCount}</span>
                            </Then>
                            <Else>
                                <Filter />
                            </Else>
                        </If>
                        Filter
                    </Button>
                    <Dropdown
                        id="filter-data-demand-chart-regional"
                        label="Regional"
                        placeholder="Pilih Regional"
                        value={input.treg}
                        options={listRegional}
                        onChange={(value) => {
                            setInput({ ...input, treg: value, page: 1 });
                        }}
                        className="w-full"
                        parentClassName="md:hidden"
                        disabled={listRegional?.length === 1}
                    />
                    <div data-testid="date-test">
                        <div className="flex flex-col text-medium md:hidden">
                            <LabelInput>Tanggal</LabelInput>
                            <div id={id} className="relative">
                                <div
                                    className="bg-white border-secondary-30 w-full flex gap-6 justify-between items-center p-3 cursor-pointer whitespace-nowrap border rounded-md md:w-[70vw]"
                                    onClick={() => setOpen(!isOpen)}
                                >
                                    <button type="button">
                                        {dayjs(input.survey_at_start).format("DD MMM YYYY")} - {dayjs(input.survey_at_end).format("DD MMM YYYY")}
                                    </button>
                                    <Calendar title="calendar-icon" />
                                </div>
                                <When condition={isOpen}>
                                    <div className="absolute bottom-0 z-10 flex flex-col min-w-full overflow-auto -translate-x-1/2 translate-y-full rounded shadow left-1/2">
                                        <DateRangePicker
                                            ranges={[
                                                {
                                                    startDate: dateTemp.startDate,
                                                    endDate: dateTemp.endDate,
                                                    key: "selection",
                                                },
                                            ]}
                                            showDateDisplay={false}
                                            onChange={(e) => {
                                                setDateTemp({
                                                    startDate: e.selection?.startDate,
                                                    endDate: e.selection?.endDate,
                                                });
                                                if (e.selection?.startDate !== e.selection?.endDate) {
                                                    setInput({
                                                        ...input,
                                                        survey_at_start: dayjs(e.selection?.startDate).format("YYYY-MM-DD"),
                                                        survey_at_end: dayjs(e.selection?.endDate).format("YYYY-MM-DD"),
                                                    });
                                                    setOpen(false);
                                                }
                                            }}
                                            staticRanges={[]}
                                            inputRanges={[]}
                                            className="max-w-[20.9rem]"
                                        />
                                    </div>
                                </When>
                            </div>
                        </div>
                    </div>
                </div>
                <When condition={isLoading}>
                    <div className="flex items-center justify-center mt-8 overflow-auto">
                        <Spinner size={"8rem"} />
                    </div>
                </When>
                <Unless condition={isLoading}>
                    <div className="flex flex-col items-center justify-center gap-8 px-4 py-8 border border-secondary-30 rounded-2xl overflow-hidden">
                        <div className="flex flex-col gap-2 w-full h-fit pb-4 overflow-auto md:scrollbar-hidden">
                            <div className="w-full font-semibold text-md text-black-80">Jumlah Responden</div>
                            <div className="w-full h-[40vh] md:w-[250%]">
                                <LineChart chartRef={chartRef} listData={chart} periodDate={periodDate} />
                            </div>
                        </div>
                        <When condition={legend?.length}>
                            <div className="flex items-center justify-center gap-4 w-full pb-4 overflow-auto 2xl:justify-start md:scrollbar-hidden">
                                {legend?.map((label, index) => {
                                    return (
                                        <div
                                            onClick={() => {
                                                const newData = [...legend];
                                                newData[index].status = !newData[index].status;
                                                setLegend(newData);
                                                const dataFilter = newData.filter((e) => e.status);
                                                setChart(dataFilter);
                                            }}
                                            key={`${index.toString()}`}
                                            className="flex items-center justify-center gap-2 p-2 text-sm border border-solid cursor-pointer rounded-2xl text-black-100"
                                            style={{
                                                borderColor: label?.status ? label?.color : "#E2E2E2",
                                                color: label?.status ? "inherit" : "#808285",
                                            }}
                                        >
                                            <div
                                                className="w-5 h-5 rounded-full"
                                                style={{
                                                    backgroundColor: label?.status ? label?.color : "gray",
                                                }}
                                            />
                                            <span className="whitespace-nowrap">{label?.witel || ""}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </When>
                    </div>
                </Unless>
            </div>
            <FilterChartMobileModal
                input={input}
                setInput={setInput}
                listRegional={listRegional}
                isOpen={isOpen}
                setOpen={setOpen}
                dateTemp={dateTemp}
                setDateTemp={setDateTemp}
            />
        </div>
    );
};

export default MainChart;
