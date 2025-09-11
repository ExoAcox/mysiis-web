import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { When } from "react-if";
import { getServer, session } from "@libs/session";

import { TitleBar } from "@features/planning/dashboard-microdemand/components/global";
import { getUserData, tabOptions } from "@features/planning/dashboard-microdemand/functions/common";
import { useFilterStore } from "@features/planning/dashboard-microdemand/store/dashboard";
import { useUserDataStore } from "@features/planning/dashboard-microdemand/store/global";

import { Responsive, Wrapper } from "@components/layout";
import { intersection } from "@functions/common";
import { MainSection } from "@features/planning/dashboard-microdemand/components/pre-survey";
import { fetchSurveyPermits } from "@features/planning/dashboard-microdemand/queries/dashboard/survey";

const MicrodemandPermitPage: React.FC<{ user: User; device: Device }> = ({ user, device }) => {
    const userDataStore = useUserDataStore();
    const filterStore = useFilterStore();
    const { regional, row, witel, vendor, status, category, surveyor, polygon, startDate, endDate } = filterStore;

    const router = useRouter();

    const getData = (init?: string) => {
        if (init) filterStore.set({ page: 1 });
        fetchSurveyPermits({ ...filterStore, page: init ? 1 : filterStore.page });
    };

    const getUser = async () => {
        const filter = await getUserData(user);
        filterStore.set(filter);
    };

    useEffect(() => {
        if(intersection(user.role_keys, ["admin-survey-branch"]).length){
            getData("init");
        }
    }, [userDataStore.role, row, regional, witel, vendor, status, category, surveyor, polygon, startDate, endDate]);

    useEffect(() => {
        if(intersection(user.role_keys, ["admin-survey-branch"]).length){
            getUser();
        }
    }, []);


    return (
        <Wrapper
            user={user}
            title="Polygon Microdemand"
            tab={{
                value: "pre-survey",
                options: tabOptions(user),
                onChange: (value) => {
                    router.push("/planning/dashboard-microdemand/" + value);
                },
            }}
            backPath="/"
        >
            <Responsive className="pt-0 pb-16">
                <TitleBar>Menu yang digunakan untuk melakukan approval pre survey.</TitleBar>
                <When condition={intersection(user.role_keys, ["admin-survey-branch"]).length}>
                    <MainSection user={user} device={device} refresh={getData} />
                </When>
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

// export const getServerSideProps: GetServerSideProps = async (context) => {
//     return {
//         notFound: true,
//     };
// };

export default MicrodemandPermitPage;
