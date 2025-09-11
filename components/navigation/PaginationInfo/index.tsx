import { When, Unless } from "react-if";

import { tw } from "@functions/style";

interface Props {
    page: number;
    row: number;
    totalCount: number;
    className?: string;
    label?: string;
}

const PaginationInfo: React.FC<Props> = ({ page, row, totalCount, className, label }) => {
    return (
        <div className={tw("text-medium text-black-100", className)}>
            <When condition={totalCount > 0}>
                <div>
                    {page * row - row + 1} - {totalCount > page * row ? page * row : totalCount} dari {totalCount} {label}
                </div>
            </When>
            <Unless condition={totalCount > 0}>
                <div>0 Data</div>
            </Unless>
        </div>
    );
};

PaginationInfo.defaultProps = {
    row: 10,
    label: "Data",
};

export default PaginationInfo;
