import { GetServerSideProps } from "next";
import { useRouter } from "next/router";

import { getServer, session } from "@libs/session";

import { TitleBar } from "@features/planning/dashboard-microdemand/components/global";
import { tabOptions } from "@features/planning/dashboard-microdemand/functions/common";

import { Responsive, Wrapper } from "@components/layout";

import MainContent from "../../../../features/planning/dashboard-microdemand/components/report/MainContent";

const Report: React.FC<{ user: User, device: Device; }> = ({ user, device }) => {
    const router = useRouter();
    return (
        <Wrapper
            user={user}
            title="Report Microdemand"
            tab={{
                value: "report",
                options: tabOptions(user),
                onChange: (value) => {
                    router.push("/planning/dashboard-microdemand/" + value);
                },
            }}
            backPath="/"
        >
            <Responsive className="pt-0 pb-16">
                <TitleBar>Menu untuk menampilkan report survey yang telah dilakukan</TitleBar>
                <MainContent user={user} device={device} />
            </Responsive>
        </Wrapper>
    );
};

export const getServerSideProps: GetServerSideProps = session(async (context) => {
    const server = await getServer({
        context,
        permissions: ["surveydemand-web"],
    });

    return server;
});

export default Report;
