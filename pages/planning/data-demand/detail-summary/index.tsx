// import { logEvent } from "firebase/analytics";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

// import { analytic } from "@libs/firebase";
import { getServer, session } from "@libs/session";

import { GetRespondentByValid, Respondent, getRespondentByValid } from "@api/survey-demand/respondent";

import useProfile from "@hooks/useProfile";

import { errorHelper } from "@functions/common";

import { MapsPreview } from "@features/planning/data-demand/components/maps";
import { FilterBar, MainTable } from "@features/planning/data-demand/components/table";
import { tabOptions } from "@features/planning/data-demand/functions/common";

import { Responsive, Wrapper } from "@components/layout";
import { Subtitle, Title } from "@components/text";

const DataDemand: React.FC<{ user: User; access: Access }> = ({ user }) => {
    const router = useRouter();
    const profile = useProfile();

    const params = {
        row: 10,
        page: 1,
    };

    const [input, setInput] = useState<GetRespondentByValid>(params);
    const [textDefault, setTextDefault] = useState("");

    const [isLoading, setLoading] = useState(false);
    const [listData, setListData] = useState<Respondent[]>([]);
    const [listAllData, setListAllData] = useState<Respondent[]>([]);
    const [totalData, setTotalData] = useState(0);
    const [dataRespondent, setDataRespondent] = useState<Respondent[]>([]);

    const fetchListData = () => {
        setLoading(true);
        setListData([]);
        setTotalData(0);
        setDataRespondent([]);
        getRespondentByValid(input)
            .then((result) => {
                const dataRespondentByValid = result?.lists.map((data) => data);
                setListData(dataRespondentByValid || []);
                setTotalData(Number(result?.filteredCount) || 0);
            })
            .catch((error) => {
                errorHelper(error);
            })
            .finally(() => setLoading(false));
    };

    const fetchListAllData = async () => {
        const customInput = { ...input };
        customInput.row = 1000;

        setListAllData([]);

        if (totalData) {
            for (let i = 1; i <= Math.ceil(totalData / 1000); i++) {
                customInput.page = i;
                await getRespondentByValid(customInput)
                    .then((result) => {
                        const dataRespondentAllByValid = result?.lists.map((data) => data);
                        setListAllData((current) => [...current, ...dataRespondentAllByValid]);
                    })
                    .catch((error) => {
                        errorHelper(error);
                    });
            }
        }
    };

    useEffect(() => {
        setTimeout(() => {
            fetchListAllData();
        }, 1000);
    }, [totalData]);

    useEffect(() => {
        fetchListData();
    }, [input]);

    // useEffect(() => {
    //     if (analytic && process.env.NODE_ENV === "production" && user.userId) {
    //         logEvent(analytic, "mysiis_data_demand_hit", {
    //             userId: user.userId,
    //             regional: user?.regional ?? "",
    //             witel: user?.witel ?? "",
    //             role: profile.role_details?.name ?? "",
    //             platform: "web",
    //         });
    //     }
    // }, [analytic]);

    return (
        <Wrapper
            user={user}
            title="Data Demand"
            screenMax
            tab={{
                value: "detail-summary",
                options: tabOptions,
                onChange: (value) => {
                    router.push(`/planning/data-demand/${value}`);
                },
            }}
            className="min-w-[600px] md:min-w-full"
            backPath="/"
        >
            <Responsive className="my-4 max-w-none">
                <Subtitle size="medium" className="text-black-100">
                    Menampilkan potensi pelanggan yang ingin menggunakan IndiHome
                </Subtitle>
                <div className="px-8 py-4 mt-4 rounded-md shadow md:pt-2">
                    <Title className="font-extrabold text-black-100 md:hidden">
                        List Detail Summary <span className="font-normal text-medium text-black-100">{"(Sumber: survey microdemand)"}</span>
                    </Title>
                    <FilterBar
                        user={user}
                        input={input}
                        setInput={setInput}
                        textDefault={textDefault}
                        setTextDefault={setTextDefault}
                        // totalData={totalData}
                        totalData={listAllData?.length}
                    />
                    <div className="relative h-[28rem]">
                        <MapsPreview listAllData={listAllData} />
                    </div>
                    <MainTable
                        input={input}
                        setInput={setInput}
                        isLoading={isLoading}
                        listData={listData}
                        // totalData={totalData}
                        totalData={listAllData?.length}
                        dataRespondent={dataRespondent}
                        setDataRespondent={setDataRespondent}
                    />
                </div>
            </Responsive>
        </Wrapper>
    );
};

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = await getServer({
        context,
        permissions: ["data-demand"],
    });

    return server;
});

export default DataDemand;
