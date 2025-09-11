import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import { getServer, session } from "@libs/session";

import { GetAllCompetitor, ListAllCompetitor, getAllCompetitor } from "@api/odp/competitor";

import { errorHelper } from "@functions/common";

import { FilterBar, MainTable } from "@features/planning/data-competitor/components/table";
import { tabOptions } from "@features/planning/data-competitor/functions/common";

import { Responsive, Wrapper } from "@components/layout";
import { Subtitle, Title } from "@components/text";

const DataCompetitor: React.FC<{ user: User; access: Access }> = ({ user }) => {
    const router = useRouter();

    const params = {
        page: 1,
        row: 10,
    };

    const [input, setInput] = useState<GetAllCompetitor>(params);
    const [textDefault, setTextDefault] = useState("");
    const [isLoading, setLoading] = useState(false);
    const [listData, setListData] = useState<ListAllCompetitor[]>([]);
    const [totalData, setTotalData] = useState(0);

    const fetchListCompetitor = async () => {
        setLoading(true);
        setListData([]);
        setTotalData(0);
        await getAllCompetitor(input)
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
        fetchListCompetitor();
    }, [input]);

    return (
        <Wrapper
            user={user}
            title="Data Competitor"
            screenMax
            tab={{
                value: "detail-competitor",
                options: tabOptions,
                onChange: (value) => {
                    router.push(`/planning/data-competitor/${value}`);
                },
            }}
            className="min-w-[600px] md:min-w-full"
            backPath="/"
        >
            <Responsive className="my-4 max-w-none">
                <Subtitle size="medium" className="text-black-100">
                    Menampilkan detail data competitor berdasarkan Witel dan Regional
                </Subtitle>
                <div className="px-8 py-4 mt-4 rounded-md shadow md:pt-2">
                    <Title className="font-extrabold text-black-100">List Detail Competitor</Title>
                    <FilterBar
                        user={user}
                        input={input}
                        setInput={setInput}
                        textDefault={textDefault}
                        setTextDefault={setTextDefault}
                        totalData={totalData}
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
        permissions: ["data-competitor"],
    });

    return server;
});

export default DataCompetitor;
