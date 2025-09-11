import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { When } from "react-if";
import { getServer, session } from "@libs/session";

import { tabOptions } from "@features/planning/dashboard-permit/functions/common";
import { getUserData } from "@features/planning/dashboard-permit/functions/common";
import { useFilterStore, useFilterSummaryStore } from "@features/planning/dashboard-permit/store/dashboard";
import { useUserDataStore } from "@features/planning/dashboard-permit/store/global";

import { Responsive, Wrapper } from "@components/layout";
import { intersection } from "@functions/common";
import { MainSection, SummarySection } from "@features/planning/dashboard-permit/components/dashboard";
import { fetchSurveyPermits } from "@features/planning/dashboard-permit/queries/dashboard/survey";
import { fetchSummaryDashboardPemits } from "@features/planning/dashboard-permit/queries/dashboard/survey";
import { getSupervisor } from "@api/survey-demand/supervisor";
import { toast } from "react-toastify";

const MicrodemandPermitPage: React.FC<{ user: User; device: Device }> = ({ user, device }) => {
    const router = useRouter();
    const userDataStore = useUserDataStore();
    const filterStore = useFilterStore();
    const filterSummaryStore = useFilterSummaryStore();

    const { regional, row, witel, status_permits, startDate, endDate, search } = filterStore;


    const getData = (init?: string) => {
        if (init) filterStore.set({ page: 1 });
        fetchSurveyPermits({ ...filterStore, page: init ? 1 : filterStore.page });
    };

    const getUser = async () => {
        const filter = await getUserData(user);
        filterStore.set({
            regional: filter.telkom_regional,
            witel: filter.telkom_witel,
            vendor: filter.vendor,
        });
        filterSummaryStore.set({
            regional: filter.telkom_regional,
            witel: filter.telkom_witel
        });
    };

    const getDataSummary = async () => {
        if(intersection(user.role_keys, ["admin-survey-nasional"]).length){
            fetchSummaryDashboardPemits({ regional: "ALL" });
        } else if(intersection(user.role_keys, ["admin-survey-region"]).length){
            fetchSummaryDashboardPemits({ regional: user.regional || "" });
        } else if(intersection(user.role_keys, ["supervisor-survey-mitra"]).length){
            const supervisor = await getSupervisor(user.userId);
            if(supervisor.telkom_treg && supervisor.telkom_witel){
                fetchSummaryDashboardPemits({ regional: supervisor.telkom_treg, witel: JSON.stringify(supervisor.telkom_witel) });
            }
        }
    };

    useEffect(() => {
        if(intersection(user.role_keys, ["supervisor-survey-mitra"]).length){
            getData("init");
        }
    }, [userDataStore.role, row, regional, witel, status_permits, startDate, endDate, search]);

    useEffect(() => {
        if(intersection(user.role_keys, ["supervisor-survey-mitra", "admin-survey-region", "admin-survey-nasional"]).length){
            getUser();
        }
    }, []);

    useEffect(() => {
        if(intersection(user.role_keys, ["supervisor-survey-mitra", "admin-survey-region", "admin-survey-nasional"]).length){
            getDataSummary();
        }
    }, []);

    // useEffect(() => {
    //     if(user.vendor !== "Telkom Akses"){
    //         router.push("/");
    //         toast.error("Unauthorized", { autoClose: 3000 });
    //     }
    // }, [user.vendor]);


    return (
        <Wrapper
            user={user}
            title="Dashboard Permit Deployment"
            tab={{
                value: "dashboard",
                options: tabOptions(user),
                onChange: (value) => {
                    router.push("/planning/dashboard-permit/" + value);
                },
            }}
            backPath="/"
        >
            <Responsive className="pt-4 pb-16">
                <SummarySection user={user} />
                <When condition={intersection(user.role_keys, ["supervisor-survey-mitra"]).length}>
                    <MainSection user={user} device={device} refresh={()=>{
                        getData();
                        getDataSummary();
                    }} />
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
