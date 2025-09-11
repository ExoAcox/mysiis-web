import dayjs from "dayjs";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { MdClose, MdSearch } from "react-icons/md";
import { Else, If, Then, When } from "react-if";

import { getRegional, getWitel } from "@api/district/network";
import { GetRespondentByValid } from "@api/survey-demand/respondent";

import useMediaQuery from "@hooks/useMediaQuery";
import useModal from "@hooks/useModal";

import { errorHelper } from "@functions/common";

import Calendar from "@images/vector/calendar.svg";
import Filter from "@images/vector/filter.svg";

import { fetchDefaultWitel, stateWitel } from "@features/planning/data-demand/functions/table";

import { Button } from "@components/button";
import { CheckBoxDropdown, Dropdown } from "@components/dropdown";
import { TextField } from "@components/input";
import { Spinner } from "@components/loader";

const FilterTableMobileModal = dynamic(() => import("../../modal/FilterTableMobileModal"), {
    loading: () => (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Spinner color="white" size={100} />
        </div>
    ),
});

interface Props {
    input: GetRespondentByValid;
    setInput: (value: GetRespondentByValid) => void;
    textDefault: string;
    setTextDefault: (value: string) => void;
    totalData: number;
    user: User;
}

const date = new Date();

const DataDemandFilter = ({ user, input, setInput, textDefault, setTextDefault, totalData }: Props): JSX.Element => {
    const [period, setPeriod] = useState(dayjs().format("YYYY-MM-DD"));
    const [listRegional, setListRegional] = useState<Option<string>[]>([{ label: "Regional 1", value: "Regional 1" }]);
    const [listWitel, setListWitel] = useState<Option<string>[]>(stateWitel);
    const [listSubscriber, setListSubscriber] = useState<string[]>([]);
    const [listScale, setListScale] = useState<string[]>([]);
    const [activeCount, setActiveCount] = useState<number>(0);

    const modalFilterTableMobile = useModal("modal-data-demand-table-filter-mobile");

    const { isMobile } = useMediaQuery(767, { debounce: false });

    const fetchRegional = () => {
        getRegional()
            .then((result) => {
                setListRegional(result.map((treg) => ({ label: treg, value: treg })));
            })
            .catch((error) => {
                errorHelper(error);
            });
    };

    const fetchWitel = (regional: { regional: string }) => {
        setListWitel(stateWitel);
        getWitel(regional)
            .then((result) => {
                setListWitel(result.map((witel) => ({ label: witel, value: witel })));
            })
            .catch((error) => {
                errorHelper(error);
            });
    };

    useEffect(() => {
        const defaultParams = {
            ...input,
            page: 1,
            row: isMobile ? 5 : 10,
            periode_start: dayjs(date).subtract(1, "months").format("YYYYMM"),
            periode_end: dayjs(date).format("YYYYMM"),
        };

        if (!user.regional || user.regional === "National" || Array.isArray(user.regional)) {
            fetchRegional();
            setInput({ ...defaultParams, treg: "Regional 1", witel: "SUMUT" });
        }

        if (user.regional && user.regional !== "National" && !Array.isArray(user.regional)) {
            setListRegional([{ label: user.regional, value: user.regional }]);

            if (user.witel && user.witel !== "All" && !Array.isArray(user.witel)) {
                setListWitel([{ label: user.witel, value: user.witel }]);
                setInput({ ...defaultParams, treg: user.regional, witel: user.witel });
            } else {
                fetchWitel({ regional: user.regional });
                setInput({ ...defaultParams, treg: user.regional, witel: fetchDefaultWitel(user.regional) });
            }
        }
    }, [isMobile, user]);

    useEffect(() => {
        setActiveCount(0);
        if (input) {
            if (input?.treg) setActiveCount((count) => ++count);
            if (input?.witel) setActiveCount((count) => ++count);
            if (input?.periode_start) setActiveCount((count) => ++count);
            if (input?.arr_conf_subscriber_plansid?.length) setActiveCount((count) => ++count);
            if (input?.arr_conf_scale_of_needid?.length) setActiveCount((count) => ++count);
        }
    }, [input]);

    return (
        <div className="w-full h-full my-8">
            <div className="flex flex-wrap items-center justify-start gap-4 md:flex-nowrap md:items-start">
                <When condition={isMobile}>
                    <Button
                        onClick={() => modalFilterTableMobile.setModal(true)}
                        className="py-2.5 text-sm w-fit"
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
                </When>
                <TextField
                    label={isMobile ? "" : "Cari"}
                    placeholder="Nama, telepon, alamat"
                    value={textDefault}
                    onChange={(value) => {
                        setInput({ ...input, keyword: value, page: 1 });
                        setTextDefault(value);
                    }}
                    prefix={<MdSearch />}
                    suffix={
                        textDefault && (
                            <button
                                onClick={() => {
                                    setInput({ ...input, keyword: null });
                                    setTextDefault("");
                                }}
                            >
                                <MdClose title="reset-search-input" />
                            </button>
                        )
                    }
                    className="w-72 md:w-full"
                    parentClassName="w-fit md:w-full"
                />
                <Dropdown
                    id="filter-data-demand-table-date"
                    label="Tanggal"
                    value={period}
                    options={Array.from({ length: 12 }).map((_, index) => {
                        const currentMonth = dayjs().subtract(index, "month");
                        const pastMonth = dayjs().subtract(index + 1, "month");

                        const option = {
                            label: `${pastMonth.format("MMM YYYY")} - ${currentMonth.format("MMM YYYY")}`,
                            value: currentMonth.format("YYYY-MM-DD"),
                        };

                        return option;
                    })}
                    onChange={(value) => {
                        setPeriod(value);
                        setInput({
                            ...input,
                            periode_start: dayjs(value).subtract(1, "month").format("YYYYMM"),
                            periode_end: dayjs(value).format("YYYYMM"),
                            page: 1,
                        });
                    }}
                    icon={<Calendar />}
                    className="w-full"
                    parentClassName="md:hidden"
                />
                <Dropdown
                    id="filter-data-demand-table-regional"
                    label="Regional"
                    placeholder="Pilih Regional"
                    value={input.treg || ""}
                    options={listRegional}
                    onChange={(value) => {
                        if (value) {
                            fetchWitel({ regional: value });

                            setTimeout(() => {
                                setInput({
                                    ...input,
                                    page: 1,
                                    treg: value,
                                    witel: fetchDefaultWitel(value),
                                });
                            }, 1000);
                        }
                    }}
                    className="w-full"
                    parentClassName="md:hidden"
                    disabled={listRegional?.length === 1}
                />
                <When condition={listWitel?.length}>
                    <Dropdown
                        id="filter-data-demand-table-witel"
                        label="Witel"
                        placeholder="Pilih Witel"
                        value={input.witel}
                        options={listWitel}
                        onChange={(value) => {
                            setInput({ ...input, witel: value, page: 1 });
                        }}
                        className="w-full"
                        parentClassName="md:hidden"
                        disabled={listWitel?.[0]?.value === "" || listWitel?.length === 1}
                    />
                </When>
                <CheckBoxDropdown
                    id="filter-data-demand-table-subscriber"
                    label="Langganan"
                    placeholder="Pilih Langganan"
                    value={listSubscriber}
                    options={[
                        {
                            label: "Kurang dari 1 bulan",
                            value: "7",
                        },
                        {
                            label: "1 bulan kedepan",
                            value: "8",
                        },
                        {
                            label: "2 - 3 bulan kedepan",
                            value: "9",
                        },
                        {
                            label: "4 - 6 bulan kedepan",
                            value: "10",
                        },
                        {
                            label: "7 - 12 bulan kedepan",
                            value: "11",
                        },
                        {
                            label: "Lebih dari 12 bulan kedepan",
                            value: "12",
                        },
                    ]}
                    onChange={(value) => {
                        setListSubscriber(value);
                        setInput({
                            ...input,
                            arr_conf_subscriber_plansid: value.filter(Boolean),
                            page: 1,
                        });
                    }}
                    className="w-full"
                    parentClassName="md:hidden"
                    disabled={totalData ? false : input?.arr_conf_subscriber_plansid?.length ? false : true}
                />
                <CheckBoxDropdown
                    id="filter-data-demand-table-scale"
                    label="Skala"
                    placeholder="Pilih Skala"
                    value={listScale}
                    options={[
                        {
                            label: "Cenderung Membutuhkan",
                            value: "10",
                        },
                        {
                            label: "Membutuhkan",
                            value: "11",
                        },
                        {
                            label: "Sangat Membutuhkan",
                            value: "12",
                        },
                    ]}
                    onChange={(value) => {
                        setListScale(value);
                        setInput({
                            ...input,
                            arr_conf_scale_of_needid: value.filter(Boolean),
                            page: 1,
                        });
                    }}
                    className="w-full"
                    parentClassName="md:hidden"
                    disabled={totalData ? false : input?.arr_conf_scale_of_needid?.length ? false : true}
                />
            </div>
            <FilterTableMobileModal
                input={input}
                setInput={setInput}
                period={period}
                setPeriod={setPeriod}
                listRegional={listRegional}
                listWitel={listWitel}
                setListWitel={setListWitel}
                stateWitel={stateWitel}
                fetchWitel={fetchWitel}
                listSubscriber={listSubscriber}
                setListSubscriber={setListSubscriber}
                listScale={listScale}
                setListScale={setListScale}
                totalData={totalData}
            />
        </div>
    );
};

export default DataDemandFilter;
