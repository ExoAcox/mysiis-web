import { useEffect, useState } from "react";
import { MdClose, MdSearch } from "react-icons/md";
import { Else, If, Then, When } from "react-if";

import { GetAllCompetitor, GetWitelCompetitor, getRegionalCompetitor, getWitelCompetitor } from "@api/odp/competitor";

import useMediaQuery from "@hooks/useMediaQuery";
import useModal from "@hooks/useModal";

import { errorHelper } from "@functions/common";

import Filter from "@images/vector/filter.svg";

import { stateMatch, stateRegional, stateWitel } from "@features/planning/data-competitor/functions/table";

import { Button } from "@components/button";
import { Dropdown } from "@components/dropdown";
import { TextField } from "@components/input";

import { FilterTableMobileModal } from "../../modal";

interface Props {
    input: GetAllCompetitor;
    setInput: (value: GetAllCompetitor) => void;
    textDefault: string;
    setTextDefault: (value: string) => void;
    totalData: number;
    user: User;
}

const DataCompetitorFilter = ({ user, input, setInput, textDefault, setTextDefault, totalData }: Props): JSX.Element => {
    const [listRegional, setListRegional] = useState<Option<string>[]>(stateRegional);
    const [listWitel, setListWitel] = useState<Option<string>[]>(stateWitel);
    const [activeCount, setActiveCount] = useState<number>(0);

    const modalFilterTableMobile = useModal("modal-data-competitor-table-filter-mobile");

    const { isMobile } = useMediaQuery(767, { debounce: false });

    const fetchRegional = () => {
        getRegionalCompetitor()
            .then((result) => {
                setListRegional([...stateRegional, ...result.map((item) => ({ label: item.regional, value: item.regional }))]);
            })
            .catch((error) => {
                errorHelper(error);
            });
    };

    const fetchWitel = async (regional: GetWitelCompetitor) => {
        setListWitel(stateWitel);
        await getWitelCompetitor(regional)
            .then((result) => {
                setListWitel([...stateWitel, ...result.map((item) => ({ label: item.witel, value: item.witel }))]);
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
        };

        if (!user.regional || user.regional === "National" || Array.isArray(user.regional)) {
            fetchRegional();
            setInput({ ...defaultParams });
        }

        if (user.regional && user.regional !== "National" && !Array.isArray(user.regional)) {
            setListRegional([{ label: user.regional, value: user.regional }]);

            if (user.witel && user.witel !== "All" && !Array.isArray(user.witel)) {
                setListWitel([{ label: user.witel, value: user.witel }]);
                setInput({ ...defaultParams, regional: user.regional, witel: user.witel });
            } else {
                fetchWitel({ regional: user.regional });
                setInput({ ...defaultParams, regional: user.regional });
            }
        }
    }, [isMobile, user]);

    useEffect(() => {
        setActiveCount(0);
        if (input) {
            if (input?.regional) setActiveCount((count) => ++count);
            if (input?.witel) setActiveCount((count) => ++count);
            if (input?.match) setActiveCount((count) => ++count);
        }
    }, [input]);

    return (
        <div className="w-full h-full mt-8">
            <div className="flex flex-wrap items-center justify-start gap-4 md:flex-nowrap md:items-start">
                <When condition={isMobile}>
                    <Button
                        onClick={() => modalFilterTableMobile.setModal(true)}
                        className="w-fit py-2.5 text-sm xs:px-2"
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
                    placeholder="Cari ID Device"
                    value={textDefault}
                    onChange={(value) => {
                        setInput({ ...input, id: value, page: 1 });
                        setTextDefault(value);
                    }}
                    prefix={<MdSearch />}
                    suffix={
                        textDefault && (
                            <button
                                onClick={() => {
                                    setInput({ ...input, id: null });
                                    setTextDefault("");
                                }}
                            >
                                <MdClose data-testid="reset-search-id-device" />
                            </button>
                        )
                    }
                    className="w-full overflow-hidden"
                    parentClassName="w-72 md:w-full"
                />
                {/* <Button onClick={() => modalDownload(input)} disabled={totalData <= 0} className="w-40 h-12 text-sm self-end" labelClassName="gap-2">
                    Download Data
                </Button> */}
                <Dropdown
                    id="filter-data-competitor-table-regional"
                    label="Regional"
                    placeholder="Pilih Regional"
                    value={input.regional || ""}
                    options={listRegional}
                    onChange={(value) => {
                        if (value) {
                            fetchWitel({ regional: value });
                            setInput({ ...input, regional: value, witel: null, page: 1 });
                        }
                        if (!value) {
                            setInput({ ...input, regional: null, witel: null, page: 1 });
                            setListWitel(stateWitel);
                        }
                    }}
                    className="w-full"
                    parentClassName="md:hidden"
                    disabled={listRegional?.length === 1}
                />
                <When condition={listWitel?.length}>
                    <Dropdown
                        id="filter-data-competitor-table-witel"
                        label="Witel"
                        placeholder="Pilih Witel"
                        value={input.witel}
                        options={listWitel}
                        onChange={(value) => {
                            setInput({ ...input, witel: value ? value : null, page: 1 });
                        }}
                        className="w-full"
                        parentClassName="md:hidden"
                        disabled={listWitel?.length === 1}
                    />
                </When>
                <Dropdown
                    id="filter-data-competitor-table-status"
                    label="Status"
                    placeholder="Pilih Status"
                    value={input.match || ""}
                    options={stateMatch}
                    onChange={(value) => {
                        setInput({ ...input, match: value ? value : null, page: 1 });
                    }}
                    className="w-full"
                    parentClassName="md:hidden"
                    disabled={!input?.match && totalData <= 0}
                />
            </div>
            <FilterTableMobileModal
                input={input}
                setInput={setInput}
                listRegional={listRegional}
                listWitel={listWitel}
                setListWitel={setListWitel}
                stateWitel={stateWitel}
                fetchWitel={fetchWitel}
                stateMatch={stateMatch}
                totalData={totalData}
            />
            {/* <DownloadTableModal /> */}
        </div>
    );
};

export default DataCompetitorFilter;
