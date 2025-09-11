import { useEffect } from "react";
import { Else, If, Then, When } from "react-if";

import { GetAllSentimentFeedback, ListAllSentimentFeedback } from "@api/multilayer/sentiment-feedback";

import useMediaQuery from "@hooks/useMediaQuery";

import EmptyState from "@images/bitmap/empty_state.png";

import { getPrediction, stateRow } from "@features/planning/sentiment-feedback/functions/table";

import { Dropdown } from "@components/dropdown";
import { Image } from "@components/layout";
import { Spinner } from "@components/loader";
import { Pagination, PaginationInfo } from "@components/navigation";
import { Table } from "@components/table";
import { Subtitle, Title } from "@components/text";

interface Props {
    input: GetAllSentimentFeedback;
    setInput: (value: GetAllSentimentFeedback) => void;
    isLoading: boolean;
    listData: ListAllSentimentFeedback[];
    totalData: number;
}

const SentimentFeedbackTable = ({ input, setInput, isLoading, listData, totalData }: Props): JSX.Element => {
    const { isMobile } = useMediaQuery(767, { debounce: false });

    useEffect(() => {
        const defaultParams = {
            ...input,
            page: 1,
            row: isMobile ? 5 : 10,
        };
        setInput({ ...defaultParams });
    }, [isMobile]);

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
                                header: "User ID",
                                value: (listData) => listData.userId || "-",
                                className: "whitespace-nowrap lg:whitespace-normal",
                            },
                            {
                                header: "Komentar",
                                value: (listData) => listData.message || "-",
                            },
                            {
                                header: "Prediksi",
                                value: (listData) => getPrediction(listData.prediction),
                                className: "whitespace-nowrap",
                            },
                            {
                                header: "Tingkat Akurasi",
                                value: (listData) => `${listData.percentage_confident}%`,
                                headerClassName: "whitespace-nowrap",
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
                            {listData?.map((data) => (
                                <div key={data._id} className="flex flex-col w-full gap-4 border-2 rounded-lg border-secondary-20">
                                    <div className="flex flex-col gap-2 p-4">
                                        <List label="ID">{data?.userId || "-"}</List>
                                        <List label="Komentar">{data?.message || "-"}</List>
                                        <List label="Prediksi">{getPrediction(data?.prediction)}</List>
                                        <List label="Tingkat Akurasi">{`${data?.percentage_confident}%`}</List>
                                    </div>
                                </div>
                            ))}
                        </When>
                    </div>
                </Else>
            </If>
            <When condition={listData.length}>
                <div className="flex items-center justify-between w-full gap-4 mt-8 md:flex-col md:justify-center md:overflow-hidden">
                    <div className="flex items-center justify-start w-full gap-4 md:justify-center">
                        <When condition={!isMobile}>
                            <Dropdown
                                id="dropdown-pagination"
                                options={stateRow.filter((item) => (item > 10 ? item < totalData : item)) as unknown as Option<number>[]}
                                value={input.row}
                                onChange={(e) => setInput({ ...input, row: e, page: 1 })}
                                position="top center"
                            />
                        </When>
                        <PaginationInfo row={input.row} page={input.page} totalCount={totalData} />
                    </div>
                    <div className="flex items-center justify-end w-full md:justify-center md:overflow-auto xs:justify-start">
                        <Pagination
                            row={input.row}
                            page={input.page}
                            totalCount={totalData}
                            onChange={(e) => setInput({ ...input, page: e })}
                            className="xs:self-start"
                        />
                    </div>
                </div>
            </When>
        </div>
    );
};

const List: React.FC<{ children: React.ReactNode; label: string }> = ({ children, label }) => {
    return (
        <div className="flex gap-2 text-sm text-black-100">
            <span className="font-bold shrink-0 w-28 sm:w-20 xs:w-16">{label}</span>
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

export default SentimentFeedbackTable;
