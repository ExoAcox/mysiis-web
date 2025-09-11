import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { When } from "react-if";

import { GetRespondentByValid } from "@api/survey-demand/respondent";

import useModal from "@hooks/useModal";

import Calendar from "@images/vector/calendar.svg";

import { fetchDefaultWitel } from "@features/planning/data-demand/functions/table";

import { Button } from "@components/button";
import { CheckBoxDropdown, Dropdown } from "@components/dropdown";
import { Modal } from "@components/layout";
import { ModalTitle } from "@components/text";

interface Props {
    input: GetRespondentByValid;
    setInput: (value: GetRespondentByValid) => void;
    period: string;
    setPeriod: (value: string) => void;
    listRegional: Option<string>[];
    listWitel: Option<string>[];
    setListWitel: (value: Option<string>[]) => void;
    stateWitel: Option<string>[];
    fetchWitel: (regional: { regional: string }) => void;
    listSubscriber: string[];
    setListSubscriber: (value: string[]) => void;
    listScale: string[];
    setListScale: (value: string[]) => void;
    totalData: number;
}

const FilterTableMobileModal = ({
    input,
    setInput,
    period,
    setPeriod,
    listRegional,
    listWitel,
    setListWitel,
    stateWitel,
    fetchWitel,
    listSubscriber,
    setListSubscriber,
    listScale,
    setListScale,
    totalData,
}: Props): JSX.Element => {
    const { modal, setModal } = useModal("modal-data-demand-table-filter-mobile");

    const [tempInput, setTempInput] = useState<GetRespondentByValid>(input);
    const [tempPeriod, setTempPeriod] = useState(period);
    const [tempListWitel, setTempListWitel] = useState<Option<string>[]>(listWitel);
    const [tempListSubscriber, setTempListSubscriber] = useState<string[]>(listSubscriber);
    const [tempListScale, setTempListScale] = useState<string[]>(listScale);

    useEffect(() => {
        setTempInput(input);
    }, [input]);

    useEffect(() => {
        setTempPeriod(period);
    }, [period]);

    useEffect(() => {
        setTempListWitel(listWitel);
    }, [listWitel]);

    useEffect(() => {
        setTempListSubscriber(listSubscriber);
    }, [listSubscriber]);

    useEffect(() => {
        setTempListScale(listScale);
    }, [listScale]);

    return (
        <Modal visible={modal} className="p-6 w-full rounded-xl">
            <div className="flex flex-col gap-4" data-testid="filter-table-mobile-modal">
                <ModalTitle
                    onClose={() => {
                        setTempInput(input);
                        setTempPeriod(period);
                        setTempListWitel(listWitel);
                        setTempListSubscriber(listSubscriber);
                        setTempListScale(listScale);
                        fetchWitel({ regional: input.treg! });
                        setModal(false);
                    }}
                    className="text-large"
                >
                    Filter
                </ModalTitle>
                <div className="flex flex-col items-center justify-center gap-4">
                    <Dropdown
                        id="filter-data-demand-table-date"
                        label="Tanggal"
                        value={tempPeriod}
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
                            setTempPeriod(value);
                            setTempInput({
                                ...tempInput,
                                periode_start: dayjs(value).subtract(1, "month").format("YYYYMM"),
                                periode_end: dayjs(value).format("YYYYMM"),
                                page: 1,
                            });
                        }}
                        className="w-full overflow-hidden"
                        parentClassName="w-full"
                        icon={<Calendar />}
                    />
                    <Dropdown
                        id="filter-data-demand-table-regional"
                        label="Regional"
                        placeholder="Pilih Regional"
                        value={tempInput.treg || ""}
                        options={listRegional}
                        onChange={(value) => {
                            if (value) {
                                fetchWitel({ regional: value });

                                setTimeout(() => {
                                    setTempInput({
                                        ...tempInput,
                                        page: 1,
                                        treg: value,
                                        witel: fetchDefaultWitel(value),
                                    });
                                }, 1000);
                            }
                        }}
                        className="w-full overflow-hidden"
                        parentClassName="w-full"
                        disabled={listRegional?.length === 1}
                    />
                    <When condition={tempListWitel?.length}>
                        <Dropdown
                            id="filter-data-demand-table-witel"
                            label="Witel"
                            placeholder="Pilih Witel"
                            value={tempInput.witel}
                            options={tempListWitel}
                            onChange={(value) => {
                                setTempInput({ ...tempInput, witel: value, page: 1 });
                            }}
                            className="w-full overflow-hidden"
                            parentClassName="w-full"
                            disabled={tempListWitel?.[0]?.value === "" || tempListWitel?.length === 1}
                        />
                    </When>
                    <CheckBoxDropdown
                        id="filter-data-demand-table-subscriber"
                        label="Langganan"
                        placeholder="Pilih Langganan"
                        value={tempListSubscriber}
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
                            setTempListSubscriber(value);
                            setTempInput({
                                ...tempInput,
                                arr_conf_subscriber_plansid: value.filter(Boolean),
                                page: 1,
                            });
                        }}
                        className="w-full overflow-hidden"
                        parentClassName="w-full"
                        disabled={totalData ? false : input?.arr_conf_subscriber_plansid?.length ? false : true}
                    />
                    <CheckBoxDropdown
                        id="filter-data-demand-table-scale"
                        label="Skala"
                        placeholder="Pilih Skala"
                        value={tempListScale}
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
                            setTempListScale(value);
                            setTempInput({
                                ...tempInput,
                                arr_conf_scale_of_needid: value.filter(Boolean),
                                page: 1,
                            });
                        }}
                        className="w-full overflow-hidden"
                        parentClassName="w-full"
                        disabled={totalData ? false : input?.arr_conf_scale_of_needid?.length ? false : true}
                    />
                    <Button
                        onClick={() => {
                            setInput({ ...tempInput });
                            setPeriod(tempPeriod);
                            setListWitel(tempListWitel);
                            setListSubscriber(tempListSubscriber);
                            setListScale(tempListScale);
                            setModal(false);
                        }}
                        className="w-full my-2"
                    >
                        Terapkan
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default FilterTableMobileModal;
