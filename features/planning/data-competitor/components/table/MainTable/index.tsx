import { Else, If, Then, When } from "react-if";

import { GetAllCompetitor, ListAllCompetitor } from "@api/odp/competitor";

import useMediaQuery from "@hooks/useMediaQuery";
import useModal from "@hooks/useModal";

import EmptyState from "@images/bitmap/empty_state.png";

import { getOverallMatch, getStatusOcc } from "@features/planning/data-competitor/functions/table";

import { Button } from "@components/button";
import { Image } from "@components/layout";
import { Spinner } from "@components/loader";
import { Pagination, PaginationInfo } from "@components/navigation";
import { Table } from "@components/table";
import { Subtitle, Title } from "@components/text";

import { DetailTableModal } from "../../modal";

interface Props {
    input: GetAllCompetitor;
    setInput: (value: GetAllCompetitor) => void;
    isLoading: boolean;
    listData: ListAllCompetitor[];
    totalData: number;
}

const DataCompetitorTable = ({ input, setInput, isLoading, listData, totalData }: Props): JSX.Element => {
    const modalDetail = useModal<ListAllCompetitor>("modal-data-competitor-table-detail");

    const { isMobile } = useMediaQuery(767, { debounce: false });

    return (
        <div className="w-full h-full mb-8">
            <If condition={!isMobile}>
                <Then>
                    <Table
                        className="mt-8"
                        rows={listData}
                        columns={[
                            {
                                header: "No",
                                value: (_, index) => input.page * input.row - input.row + (index + 1),
                                className: "text-right",
                                headerClassName: "text-right",
                            },
                            {
                                header: "ID Device",
                                value: (listData) => listData.device_id || "-",
                                className: "whitespace-nowrap",
                            },
                            {
                                header: "Device Name",
                                value: (listData) => listData.devicename || "-",
                                className: "min-w-[10rem]",
                            },
                            {
                                header: "Regional",
                                value: (listData) => listData.regional || "-",
                                className: "whitespace-nowrap",
                            },
                            {
                                header: "STO Name",
                                value: (listData) => listData.stoname || "-",
                            },
                            {
                                header: "Status OCC",
                                value: (listData) => getStatusOcc(listData.status_occ),
                            },
                            {
                                header: "Witel",
                                value: (listData) => listData.witel || "-",
                            },
                            {
                                header: "Status",
                                value: (listData) => getOverallMatch(listData.overall_match),
                                className: "whitespace-nowrap",
                            },
                            {
                                header: "Aksi",
                                value: () => {
                                    return <Button className="px-2 py-1">Lihat</Button>;
                                },
                                onClick: (listData) => {
                                    modalDetail.setModal(true);
                                    modalDetail.setData(listData);
                                },
                                className: "text-center",
                                headerClassName: "text-center",
                            },
                        ]}
                        loading={isLoading}
                        notFoundComponent={<NotFoundComponent />}
                    />
                </Then>
                <Else>
                    <div className="flex flex-col items-center justify-center w-full gap-4 mt-8 overflow-hidden">
                        <When condition={isLoading}>
                            <Spinner className="py-8" size={100} />
                        </When>
                        <When condition={!listData.length && !isLoading}>
                            <NotFoundComponent />
                        </When>
                        <When condition={listData.length}>
                            {listData?.map((data, index) => (
                                <div
                                    key={`${data.device_id}.${index.toString()}`}
                                    className="flex flex-col w-full gap-4 border-2 rounded-lg border-secondary-20"
                                >
                                    <div className="flex items-center justify-between gap-4 p-4 bg-secondary-20">
                                        <div className="flex flex-col gap-2">
                                            <span className="font-bold">{`ID ${data?.device_id || "-"}`}</span>
                                            <span className="text-sm">{`${data?.regional || "-"} | ${data?.witel || "-"}`}</span>
                                        </div>
                                        <div>
                                            <span className="font-bold">{getOverallMatch(data?.overall_match)}</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-2 px-4 pb-4">
                                        <List label="Device Name">{data?.devicename || "-"}</List>
                                        <List label="STO Name">{data?.stoname || "-"}</List>
                                        <List label="Status OCC">{getStatusOcc(data?.status_occ)}</List>
                                        <Button
                                            className="self-center w-full py-1 text-sm"
                                            onClick={() => {
                                                modalDetail.setModal(true);
                                                modalDetail.setData(data);
                                            }}
                                        >
                                            Lihat
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </When>
                    </div>
                </Else>
            </If>
            <When condition={listData.length}>
                <div className="flex items-center justify-between w-full gap-4 mt-8 overflow-hidden md:flex-col md:justify-center">
                    <div className="flex justify-start w-full md:justify-center">
                        <PaginationInfo row={input.row} totalCount={totalData} page={input.page} />
                    </div>
                    <div className="flex justify-end w-full overflow-auto md:justify-center xs:justify-start">
                        <Pagination onChange={(e) => setInput({ ...input, page: e })} row={input.row} totalCount={totalData} page={input.page} />
                    </div>
                </div>
            </When>
            <DetailTableModal />
        </div>
    );
};

const List: React.FC<{ children: React.ReactNode; label: string }> = ({ children, label }) => {
    return (
        <div className="flex gap-2 text-sm text-black-100">
            <span className="font-bold shrink-0 w-28 sm:w-20">{label}</span>
            <span className="font-bold w-fit">:</span>
            <span className="w-fit">{children}</span>
        </div>
    );
};

const NotFoundComponent: React.FC = () => {
    return (
        <div className="py-8 text-center">
            <Image src={EmptyState} width={288} height={200} />
            <Title className="mt-4 mb-2 text-2xl font-extrabold">Data Tidak Ditemukan</Title>
            <Subtitle size="subtitle" className="text-black-80">
                Gunakan kata kunci lain atau ubah filter & silakan coba lagi
            </Subtitle>
        </div>
    );
};

export default DataCompetitorTable;
