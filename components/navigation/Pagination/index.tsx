import dynamic from "next/dynamic";
import { tw } from "@functions/style";

import { MdNavigateNext, MdNavigateBefore } from "react-icons/md";

import styles from "./styles.module.scss";

const ReactPaginate = dynamic(() => import("react-paginate"), { ssr: false });

interface Props {
    page: number;
    onChange: (page: number) => void;
    row: number;
    totalCount: number;
    className?: string;
    pageRangeDisplayed?: number;
}

const Pagination: React.FC<Props> = ({ page, onChange, row, totalCount, className, pageRangeDisplayed = 5 }) => {
    return (
        <div className={tw("w-fit", className)}>
            <ReactPaginate
                previousLabel={<MdNavigateBefore />}
                nextLabel={<MdNavigateNext />}
                breakLabel={"..."}
                forcePage={page - 1 || 0}
                breakClassName={"break-me"}
                pageCount={totalCount ? Math.ceil(totalCount / row) : 1}
                marginPagesDisplayed={2}
                pageRangeDisplayed={pageRangeDisplayed}
                onPageChange={(data) => {
                    onChange(data.selected + 1);
                }}
                containerClassName={styles.pagination}
                activeClassName={styles.active}
            />
        </div>
    );
};

Pagination.defaultProps = {
    row: 10,
};

export default Pagination;
