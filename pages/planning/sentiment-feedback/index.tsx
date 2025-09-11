import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";

import { getServer, session } from "@libs/session";

import { GetAllSentimentFeedback, ListAllSentimentFeedback, getAllSentimentFeedback } from "@api/multilayer/sentiment-feedback";

import { errorHelper } from "@functions/common";

import { FilterBar, MainTable } from "@features/planning/sentiment-feedback/components/table";

import { Responsive, Wrapper } from "@components/layout";

const SentimentFeedback: React.FC<{ user: User; access: Access }> = ({ user }) => {
    const params = {
        page: 1,
        row: 10,
    };

    const [input, setInput] = useState<GetAllSentimentFeedback>(params);
    const [isLoading, setLoading] = useState(true);
    const [listData, setListData] = useState<ListAllSentimentFeedback[]>([]);
    const [totalData, setTotalData] = useState(0);
    const [textDefault, setTextDefault] = useState("");

    const fetchListSentimentFeedback = () => {
        setLoading(true);
        setListData([]);
        setTotalData(0);
        getAllSentimentFeedback(input)
            .then((result) => {
                setListData(result.data || []);
                setTotalData(Number(result.meta?.all_data) || 0);
            })
            .catch((error) => {
                errorHelper(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchListSentimentFeedback();
    }, [input]);

    return (
        <Wrapper user={user} title="Sentiment Feedback" screenMax className="min-w-[600px] md:min-w-full">
            <Responsive className="my-4 max-w-none">
                <div className="px-8 py-4 mt-4 rounded-md shadow">
                    <FilterBar
                        input={input}
                        setInput={setInput}
                        textDefault={textDefault}
                        setTextDefault={setTextDefault}
                        totalData={totalData}
                        refresh={fetchListSentimentFeedback}
                        user={user}
                    />
                    <MainTable input={input} setInput={setInput} isLoading={isLoading} listData={listData} totalData={totalData} />
                </div>
            </Responsive>
        </Wrapper>
    );
};

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = await getServer({
        context,
        permissions: ["development"],
    });

    return server;
});

export default SentimentFeedback;
