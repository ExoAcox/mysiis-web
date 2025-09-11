import dayjs from "dayjs";
import { DateRangePicker } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { When } from "react-if";

import { GetRespondentByWitel } from "@api/survey-demand/respondent";

import useModal from "@hooks/useModal";

import Calendar from "@images/vector/calendar.svg";

import { Button } from "@components/button";
import { Dropdown } from "@components/dropdown";
import { Modal } from "@components/layout";
import { LabelInput, ModalTitle } from "@components/text";

interface Props {
    input: GetRespondentByWitel;
    setInput: (value: GetRespondentByWitel) => void;
    listRegional: Option<string>[];
    isOpen: boolean;
    setOpen: (value: boolean) => void;
    dateTemp: { startDate?: Date; endDate?: Date };
    setDateTemp: (value: { startDate?: Date; endDate?: Date }) => void;
}

const FilterChartMobileModal = ({ input, setInput, listRegional, isOpen, setOpen, dateTemp, setDateTemp }: Props): JSX.Element => {
    const { modal, setModal } = useModal("modal-data-demand-chart-filter-mobile");

    return (
        <Modal visible={modal} className="p-6 w-fit rounded-xl">
            <div className="flex flex-col gap-4">
                <ModalTitle onClose={() => setModal(false)} className="text-large">
                    Filter
                </ModalTitle>
                <div className="flex flex-col items-start justify-center gap-4">
                    <div className="flex flex-col text-medium">
                        <LabelInput>Tanggal</LabelInput>
                        <div id="filter-data-demand-chart-date" className="relative">
                            <div
                                className="bg-white border-secondary-30 w-full flex gap-6 justify-between items-center p-3 cursor-pointer whitespace-nowrap border rounded-md xs:w-60 xs:overflow-hidden"
                                onClick={() => setOpen(!isOpen)}
                            >
                                <button type="button">
                                    {dayjs(input.survey_at_start).format("DD MMM YYYY")} - {dayjs(input.survey_at_end).format("DD MMM YYYY")}
                                </button>
                                <Calendar title="calendar-icon-mobile" />
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
                                                startDate: e.selection.startDate,
                                                endDate: e.selection.endDate,
                                            });
                                            if (e.selection.startDate !== e.selection.endDate) {
                                                setInput({
                                                    ...input,
                                                    survey_at_start: dayjs(e.selection.startDate).format("YYYY-MM-DD"),
                                                    survey_at_end: dayjs(e.selection.endDate).format("YYYY-MM-DD"),
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
                    <Dropdown
                        id="filter-data-demand-chart-regional"
                        label="Regional"
                        placeholder="Pilih Regional"
                        value={input.treg}
                        options={listRegional}
                        onChange={(value) => {
                            setInput({ ...input, treg: value, page: 1 });
                        }}
                        className="w-full overflow-hidden"
                        parentClassName="w-full"
                        disabled={listRegional?.length === 1}
                    />
                    <Button onClick={() => setModal(false)} className="w-full my-2">
                        Terapkan
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default FilterChartMobileModal;
