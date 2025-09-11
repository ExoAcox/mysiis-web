import { When } from "react-if";

import { GetAllCompetitor } from "@api/odp/competitor";

import useModal from "@hooks/useModal";

import { Button } from "@components/button";
import { Dropdown } from "@components/dropdown";
import { Modal } from "@components/layout";
import { ModalTitle } from "@components/text";

interface Props {
    input: GetAllCompetitor;
    setInput: (value: GetAllCompetitor) => void;
    listRegional: Option<string>[];
    listWitel: Option<string>[];
    setListWitel: (value: Option<string>[]) => void;
    stateWitel: Option<string>[];
    fetchWitel: (regional: { regional: string }) => void;
    stateMatch: Option<string>[];
    totalData: number;
}

const FilterTableMobileModal = ({
    input,
    setInput,
    listRegional,
    listWitel,
    setListWitel,
    stateWitel,
    fetchWitel,
    stateMatch,
    totalData,
}: Props): JSX.Element => {
    const { modal, setModal } = useModal("modal-data-competitor-table-filter-mobile");

    return (
        <Modal visible={modal} className="p-6 w-full rounded-xl">
            <div className="flex flex-col gap-4" data-testid="filter-table-mobile-modal">
                <ModalTitle onClose={() => setModal(false)} className="text-large">
                    Filter
                </ModalTitle>
                <div className="flex flex-col items-start justify-center gap-4">
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
                        className="w-full overflow-hidden"
                        parentClassName="w-full"
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
                            className="w-full overflow-hidden"
                            parentClassName="w-full"
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
                        className="w-full overflow-hidden"
                        parentClassName="w-full"
                        disabled={!input?.match && totalData <= 0}
                    />
                    <Button onClick={() => setModal(false)} className="w-full my-2">
                        Terapkan
                    </Button>
                </div>
            </div>
        </Modal>
    );
};

export default FilterTableMobileModal;
