import { Case, Default, Switch, When } from "react-if";

import { tw } from "@functions/style";

import { Spinner } from "@components/loader";

interface TableMobileProps<Data> {
    rows: Data[];
    columns: {
        header?: React.ReactNode;
        value: (data: Data, index: number) => React.ReactNode;
        valueClassName?: string;
        headerClassName?: string;
    }[];
    onClick?: (data: Data, index: number) => void;
    className?: string;
    headerClassName?: string;
    parentClassName?: string;
    loading?: boolean;
    error?: string | number | boolean | object | null;
    loadingComponent?: React.ReactNode;
    notFoundComponent?: React.ReactNode;
    errorComponent?: React.ReactNode;
}

const TableMobile = <Data,>({
    rows,
    columns,
    error,
    errorComponent,
    loading,
    loadingComponent,
    notFoundComponent,
    onClick,
    headerClassName,
    parentClassName,
    className,
}: TableMobileProps<Data>) => {
    return (
        <div>
            <Switch>
                <Case condition={loading}>
                    <div>{loadingComponent}</div>
                </Case>
                <Case condition={!rows.length && !error}>
                    <div>{notFoundComponent}</div>
                </Case>
                <Case condition={!!error}>
                    <div>{errorComponent}</div>
                </Case>
                <Default>
                    <div className={tw("border border-secondary-20 rounded-md", parentClassName)}>
                        {rows.map((row, rowIndex) => (
                            <div
                                key={`${rowIndex.toString()}`}
                                className={tw("px-3 py-4 border-b border-secondary-20 last:border-0", className)}
                                onClick={() => {
                                    if (onClick) onClick(row, rowIndex);
                                }}
                            >
                                <div className="flex flex-col gap-3">
                                    {columns.map((column, columnIndex) => (
                                        <div className="align-top text-medium" key={`${rowIndex.toString()}.${columnIndex.toString()}`}>
                                            <When condition={!!column.header}>
                                                <span className={tw("font-bold inline-block w-[40%]", headerClassName, column.headerClassName)}>
                                                    {column.header}
                                                </span>
                                                <span>: </span>
                                            </When>
                                            <span className={tw("inline-block", column.valueClassName)}>{column.value(row, columnIndex)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </Default>
            </Switch>
        </div>
    );
};

TableMobile.defaultProps = {
    loadingComponent: <Spinner className="py-16" size={100} />,
    notFoundComponent: <div className="py-24 mx-auto font-bold w-fit text-subtitle">Data Tidak Ditemukan</div>,
    errorComponent: <div className="py-24 mx-auto font-bold w-fit text-subtitle">Terjadi Kesalahan :(</div>,
};

export default TableMobile;
