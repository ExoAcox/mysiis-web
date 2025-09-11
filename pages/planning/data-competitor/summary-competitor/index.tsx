import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { session, getServer } from "@libs/session";

import { Wrapper, Responsive } from "@components/layout";
import { Title, Subtitle } from "@components/text";

import { MainChart } from "@features/planning/data-competitor/components/chart";
import { tabOptions } from "@features/planning/data-competitor/functions/common";

const DataCompetitor: React.FC<{ user: User; access: Access }> = ({ user }) => {
    const router = useRouter();

    return (
        <Wrapper
            user={user}
            title="Data Competitor"
            screenMax
            tab={{
                value: "summary-competitor",
                options: tabOptions,
                onChange: (value) => {
                    router.push(`/planning/data-competitor/${value}`);
                },
            }}
            backPath="/"
        >
            <Responsive className="my-4 max-w-none">
                <Subtitle size="medium" className="text-black-100">
                    Menampilkan summary data competitor berdasarkan Witel dan Regional
                </Subtitle>
                <div className="px-8 py-4 mt-4 rounded-md shadow md:pt-2">
                    <Title className="font-extrabold text-black-100">Summary Competitor</Title>
                    <MainChart user={user} />
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
