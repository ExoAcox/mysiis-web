import dayjs from "dayjs";
import { Else, If, Then, When } from "react-if";

import { GetRespondentByValid, Respondent } from "@api/survey-demand/respondent";

import useMediaQuery from "@hooks/useMediaQuery";
import useModal from "@hooks/useModal";

import EmptyState from "@images/bitmap/empty_state.png";

import { Button } from "@components/button";
import { Image } from "@components/layout";
import { Spinner } from "@components/loader";
import { Pagination, PaginationInfo } from "@components/navigation";
import { Table } from "@components/table";
import { Subtitle, Title } from "@components/text";

import { DetailTableModal } from "../../modal";

interface Props {
    input: GetRespondentByValid;
    setInput: (value: GetRespondentByValid) => void;
    isLoading: boolean;
    listData: Respondent[];
    totalData: number;
    dataRespondent: Respondent[];
    setDataRespondent: (value: Respondent[]) => void;
}

const DataDemandTable = ({ input, setInput, isLoading, listData, totalData, dataRespondent, setDataRespondent }: Props): JSX.Element => {
    const modalDetail = useModal<Respondent>("modal-data-demand-table-detail");

    const { isMobile } = useMediaQuery(767, { debounce: false });

    return (
        <div className="w-full h-full my-8">
            <If condition={!isMobile}>
                <Then>
                    <Table
                        className="mt-8"
                        rows={listData}
                        columns={[
                            {
                                header: "No",
                                value: (_, index) => input.page! * input.row - input.row + (index + 1),
                                className: "text-right",
                                headerClassName: "text-right",
                            },
                            { header: "ID", value: (listData) => listData.id || "-" },
                            { header: "Nama", value: (listData) => listData.name, className: "whitespace-nowrap" },
                            { header: "Telepon", value: (listData) => listData.phone || "-" },
                            {
                                header: "Alamat",
                                value: (listData) => listData.address || "-",
                                className: "min-w-[18.75rem]",
                                headerClassName: "text-center",
                            },
                            { header: "Regional", value: (listData) => listData.lat_long_treg || "-", className: "whitespace-nowrap" },
                            { header: "Witel", value: (listData) => listData.witel || "-" },
                            { header: "Skala", value: (listData) => listData.conf_scale_of_need_value || "-" },
                            { header: "Langganan", value: (listData) => listData.conf_subscribe_plans_value || "-", className: "min-w-[8rem]" },
                            {
                                header: "Count ODP Ready",
                                value: (listData) => listData.count_odp_ready || "-",
                                className: "min-w-[7rem] text-center",
                                headerClassName: "text-center",
                            },
                            {
                                header: "Tanggal",
                                value: (listData) => (listData.survey_at ? dayjs(listData.survey_at).format("DD-MM-YYYY") : "-"),
                                className: "min-w-[7rem]",
                            },
                            {
                                header: "Aksi",
                                value: () => {
                                    return <Button variant="nude">Lihat</Button>;
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
                    <div className="flex flex-col items-center justify-center w-full mt-8 overflow-hidden border rounded-lg border-secondary-20">
                        <When condition={isLoading}>
                            <Spinner className="py-8" size={100} />
                        </When>
                        <When condition={!listData.length && !isLoading}>
                            <NotFoundComponent />
                        </When>
                        <When condition={listData.length}>
                            {listData?.map((data) => (
                                <div key={data.id} className="flex items-start justify-start w-full gap-4 px-3 py-4 border border-secondary-20">
                                    <div className="flex flex-col gap-2">
                                        <List label="Nama">{data?.name}</List>
                                        <List label="Skala">{data?.conf_scale_of_need_value || "-"}</List>
                                        <List label="Langganan">{data?.conf_subscribe_plans_value || "-"}</List>
                                        <List label="Count ODP">{data?.count_odp_ready || "-"}</List>
                                        <Button
                                            variant="nude"
                                            className="p-0 text-sm"
                                            onClick={() => {
                                                modalDetail.setModal(true);
                                                modalDetail.setData(data);
                                            }}
                                        >
                                            Lihat Detail
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
                        <PaginationInfo row={input.row} totalCount={totalData} page={input.page!} />
                    </div>
                    <div className="flex justify-end w-full overflow-auto md:justify-center xs:justify-start">
                        <Pagination onChange={(e) => setInput({ ...input, page: e })} row={input.row} totalCount={totalData} page={input.page!} />
                    </div>
                </div>
            </When>
            <DetailTableModal />
            {/* <SendWhatsAppModal dataRespondent={dataRespondent} setDataRespondent={setDataRespondent} setCheckbox={setCheckbox} /> */}
        </div>
    );
};

const List: React.FC<{ children: React.ReactNode; label: string }> = ({ children, label }) => {
    return (
        <div className="flex gap-2 text-sm text-black-100">
            <span className="w-20 font-bold shrink-0 xs:w-16">{label}</span>
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

export default DataDemandTable;
