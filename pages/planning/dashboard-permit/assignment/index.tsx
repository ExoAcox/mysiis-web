import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { getServer, session } from "@libs/session";
import { When } from "react-if";

import { Responsive, Wrapper } from "@components/layout";

import { getUserData, tabOptions } from "@features/planning/dashboard-permit/functions/common";
import { useUserDataStore } from "@features/planning/dashboard-permit/store/global";
import { SurveyorActivateModal, SurveyorAddModal, SurveyorFilter, SurveyorTable } from "@features/planning/dashboard-permit/components/assignment";
import { useFilterStore } from "@features/planning/dashboard-permit/store/assignment";
import { fetchSurveyorAssignment } from "@features/planning/dashboard-permit/queries/assignment/surveyor";
import { fetchPolygon } from "@features/planning/dashboard-microdemand/queries/global/polygon";
import { fetchListUser } from "@features/planning/dashboard-microdemand/queries/global/user";

const MicrodemandPermitAssignmentPage: React.FC<{ user: User; device: Device }> = ({ user, device }) => {
    const router = useRouter();
    const userDataStore = useUserDataStore();
    const filterStore = useFilterStore();
    const { userid, mysistaid, row } = filterStore;

    const getData = (init?: string) => {
        if (init) filterStore.set({ page: 1 });

        if (userDataStore.role === "supervisor-survey-mitra") {
            fetchSurveyorAssignment({ page: init ? 1 : filterStore.page, row, supervisorid: user.userId, userid, mysistaid });
        }
    };

    const getUser = async () => {
        const filter = await getUserData(user);
        filterStore.set(filter);
    };

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        if (userDataStore.role) getData("init");
    }, [userDataStore.role, userid, mysistaid, row]);

    useEffect(() => {
        if (userDataStore.role === "supervisor-survey-mitra") { 
            fetchListUser({ regional: [userDataStore.regional], witel: userDataStore.witel, vendor: "telkomakses" });
            fetchPolygon(user.userId);
        }
    }, [userDataStore.role]);

    return (
        <Wrapper
            user={user}
            title="Assignment Permit Deployment"
            tab={{
                value: "assignment",
                options: tabOptions(user),
                onChange: (value) => {
                    router.push("/planning/dashboard-permit/" + value);
                },
            }}
            backPath="/"
        >
            <Responsive className="pt-4 pb-16">
                <When condition={userDataStore.role === "supervisor-survey-mitra"}>
                    <SurveyorFilter device={device} />
                    <SurveyorTable user={user} device={device} />
                    <SurveyorActivateModal refresh={getData} />
                    <SurveyorAddModal user={user} refresh={getData} />
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

export default MicrodemandPermitAssignmentPage;
