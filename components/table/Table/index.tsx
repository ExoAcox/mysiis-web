import { Case, Default, Switch, When } from "react-if";

import { tw } from "@functions/style";

import { Spinner } from "@components/loader";

export interface TableProps<Data> {
    rows: Data[];
    columns: ({
        header: React.ReactNode;
        value: (data: Data, index: number) => React.ReactNode;
        onClick?: (data: Data, index: number) => void;
        className?: string;
        headerClassName?: string;
    } | null)[];
    onClick?: (data: Data, index: number) => void;
    onScroll?: (value: { top: number; left: number }) => void;
    className?: string;
    parentClassName?: string;
    headerClassName?: string;
    bodyClassName?: string;
    hideHeader?: boolean;
    loading?: boolean;
    loadingComponent?: React.ReactNode;
    notFoundComponent?: React.ReactNode;
    error?: FetchError | null | string | boolean;
    errorComponent?: React.ReactNode;
}

const Table = <Data,>({
    rows = [],
    columns,
    onClick,
    onScroll,
    className,
    parentClassName,
    bodyClassName,
    headerClassName,
    hideHeader,
    notFoundComponent,
    loading,
    loadingComponent,
    error,
    errorComponent,
}: TableProps<Data>) => {
    return (
        <div
            className={tw("overflow-auto relative", parentClassName)}
            onScroll={(e) => {
                const target = e.target as HTMLElement;
                if (onScroll) onScroll({ top: target.scrollTop, left: target.scrollLeft });
            }}
        >
            <table className={tw("w-full text-medium", className)}>
                <When condition={!hideHeader}>
                    <thead className="sticky top-0 font-bold text-black-80">
                        <tr>
                            {columns.map((column) => {
                                if (column != null)
                                    return (
                                        <th
                                            className={tw(
                                                "bg-secondary-20 text-left p-3.5 first:rounded-tl-xl last:rounded-tr-xl",
                                                headerClassName,
                                                column.headerClassName
                                            )}
                                            key={String(column.header)}
                                        >
                                            {column.header}
                                        </th>
                                    );
                            })}
                        </tr>
                    </thead>
                </When>
                <tbody className="text-black-100">
                    <Switch>
                        <Case condition={loading}>
                            <tr>
                                <td colSpan={columns.length}>{loadingComponent}</td>
                            </tr>
                        </Case>
                        <Case condition={(!rows.length && !error) || (typeof error === "object" && error?.code === 404)}>
                            <tr>
                                <td colSpan={columns.length}>{notFoundComponent}</td>
                            </tr>
                        </Case>
                        <Case condition={!!error}>
                            <tr>
                                <td colSpan={columns.length}>{errorComponent}</td>
                            </tr>
                        </Case>
                        <Default>
                            {rows.map((row, trIndex) => {
                                return (
                                    <tr key={`${trIndex.toString()}`} className="border-b">
                                        {columns.map((column, tdIndex) => {
                                            if (column != null)
                                                return (
                                                    <td
                                                        key={`${trIndex.toString()}.${tdIndex.toString()}`}
                                                        className={tw("bg-white border-b px-3.5 py-5", bodyClassName, column.className)}
                                                        onClick={() => {
                                                            if (column.onClick) return column.onClick(row, trIndex);
                                                            if (onClick) return onClick(row, trIndex);
                                                        }}
                                                    >
                                                        {column.value(row, trIndex)}
                                                    </td>
                                                );
                                        })}
                                    </tr>
                                );
                            })}
                        </Default>
                    </Switch>
                </tbody>
            </table>
        </div>
    );
};

Table.defaultProps = {
    loadingComponent: <Spinner className="py-16" size={100} />,
    notFoundComponent: <div className="py-24 mx-auto font-bold w-fit text-subtitle">Data Tidak Ditemukan</div>,
    errorComponent: <div className="py-24 mx-auto font-bold w-fit text-subtitle">Terjadi Kesalahan :(</div>,
};

export default Table;
