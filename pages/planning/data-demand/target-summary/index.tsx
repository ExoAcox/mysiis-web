import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { getServer, session } from "@libs/session";

import { MainChart } from "@features/planning/data-demand/components/chart";
import { tabOptions } from "@features/planning/data-demand/functions/common";

import { Responsive, Wrapper } from "@components/layout";
import { Subtitle, Title } from "@components/text";

const DataDemand: React.FC<{ user: User; access: Access }> = ({ user }) => {
    const router = useRouter();

    return (
        <Wrapper
            user={user}
            title="Data Demand"
            screenMax
            tab={{
                value: "target-summary",
                options: tabOptions,
                onChange: (value) => {
                    router.push(`/planning/data-demand/${value}`);
                },
            }}
            backPath="/"
        >
            <Responsive className="my-4 max-w-none">
                <Subtitle size="medium" className="text-black-100">
                    Menampilkan data statistik hasil microdemand per Bulan, Witel atau Surveyor
                </Subtitle>
                <div className="px-8 py-4 mt-4 rounded-md shadow md:pt-2">
                    <Title className="font-extrabold text-black-100 md:hidden">
                        Summary Target berdasarkan Regional{" "}
                        <span className="font-normal text-medium text-black-100">{"(Sumber: survey microdemand)"}</span>
                    </Title>
                    <MainChart user={user} />
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
