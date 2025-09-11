import { Dropdown } from "@components/dropdown";
import { PaginationInfo, Pagination as Pagination_ } from "@components/navigation";

interface Props {
    totalCount: number;
    page: number;
    onPageChange: (page: number) => void;
    onRowChange: (row: number) => void;
    row: number;
}

const Pagination: React.FC<Props> = ({ totalCount, page, onPageChange, row, onRowChange }) => {
    return (
        <div className="flex flex-row items-center justify-between gap-4 mt-8 md:flex-col md:justify-center md:mb-6">
            <div className="flex items-center gap-3">
                <Dropdown
                    id="dropdown-pagination"
                    options={[10, 20, 30, 50, 100]}
                    value={row}
                    onChange={(row) => onRowChange(row)}
                    position="top center"
                />
                <PaginationInfo row={row} totalCount={totalCount} page={page} />
            </div>
            <Pagination_
                totalCount={totalCount}
                page={page}
                onChange={(page) => {
                    onPageChange(page);
                }}
                row={row}
            />
        </div>
    );
};

export default Pagination;
