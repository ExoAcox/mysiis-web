import { HiUpload } from "react-icons/hi";
import { MdSearch } from "react-icons/md";
import { VscRefresh } from "react-icons/vsc";

import useModal from "@hooks/useModal";

import { Filter } from "@pages/support/rpa-pooling";

import { Button } from "@components/button";
import { DateRangePicker } from "@components/calendar";
import { Dropdown } from "@components/dropdown";
import { TextField } from "@components/input";

interface Props {
    filter: Filter;
    setFilter: (filter: Filter) => void;
    refresh: () => void;
}

const Header: React.FC<Props> = ({ filter, setFilter, refresh }) => {
    const { setModal } = useModal("rpa-pooling-upload");

    return (
        <div className="flex flex-wrap items-end gap-6 mb-6">
            <div className="flex flex-wrap gap-4 mr-auto">
                <TextField
                    label="Cari"
                    placeholder="Nama file ..."
                    prefix={<MdSearch className="w-5 h-5" />}
                    value={filter.filename}
                    onChange={(filename) => setFilter({ ...filter, filename })}
                />
                <DateRangePicker
                    label="Tanggal"
                    id="filter-date"
                    value={{
                        start: filter.created_at_start,
                        end: filter.created_at_end,
                    }}
                    onChange={(start, end) => setFilter({ ...filter, created_at_start: start, created_at_end: end })}
                />
                <Dropdown
                    id="filter-status"
                    label="Status"
                    value={filter.status}
                    options={[
                        { label: "Semua Status", value: undefined },
                        { label: "Finished", value: "FINISHED" },
                        { label: "Requested", value: "REQUESTED" },
                        { label: "Failed", value: "FAILED" },
                    ]}
                    onChange={(status) => setFilter({ ...filter, status })}
                />
            </div>
            <div className="flex gap-4">
                <Button className="h-12 px-4" variant="ghost" onClick={refresh}>
                    <VscRefresh className="w-4.5 mr-0.5 h-4.5" /> Muat Ulang
                </Button>
                <Button className="h-12 px-4" onClick={() => setModal(true)}>
                    <HiUpload className="w-4.5 mr-0.5 h-4.5" /> Upload
                </Button>
            </div>
        </div>
    );
};

export default Header;
