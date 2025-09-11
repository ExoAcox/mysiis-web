import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { When } from "react-if";

import { getServer, session } from "@libs/session";

import {
    SurveyorActivateModal,
    SurveyorAddModal,
    SurveyorFilter,
    SurveyorTable,
} from "@features/planning/dashboard-microdemand/components/assignment";
import { Container, TitleBar } from "@features/planning/dashboard-microdemand/components/global";
import { getUserData, tabOptions } from "@features/planning/dashboard-microdemand/functions/common";
import { fetchListSupervisor } from "@features/planning/dashboard-microdemand/queries/assignment/supervisor";
import { fetchSurveyorAssignment } from "@features/planning/dashboard-microdemand/queries/assignment/surveyor";
import { fetchPolygon } from "@features/planning/dashboard-microdemand/queries/global/polygon";
import { fetchListUser } from "@features/planning/dashboard-microdemand/queries/global/user";
import { useFilterStore } from "@features/planning/dashboard-microdemand/store/assignment";
import { useUserDataStore } from "@features/planning/dashboard-microdemand/store/global";

import { Responsive, Wrapper } from "@components/layout";
import { Title } from "@components/text";

const MicrodemandAssignmentPage: React.FC<{ user: User; device: Device }> = ({ user, device }) => {
    const userDataStore = useUserDataStore();
    const filterStore = useFilterStore();
    const { userid, mysistaid, row } = filterStore;

    const router = useRouter();

    const getData = (init?: string) => {
        if (init) filterStore.set({ page: 1 });

        if (userDataStore.role === "admin-survey-mitra") {
            fetchListSupervisor(filterStore);
        }

        if (userDataStore.role === "supervisor-survey-mitra") {
            fetchSurveyorAssignment({ page: init ? 1 : filterStore.page, row, supervisorid: user.userId, userid, mysistaid });
        }

        if (userDataStore.role === "admin-survey-branch") {
            fetchSurveyorAssignment({ page: init ? 1 : filterStore.page, row, supervisorid: user.userId, userid, mysistaid });
        }
    };

    const getUser = async () => {
        const filter = await getUserData(user);
        filterStore.set(filter);
    };

    useEffect(() => {
        if (userDataStore.role) getData("init");
    }, [userDataStore.role, userid, mysistaid, row]);

    useEffect(() => {
        if (userDataStore.role === "supervisor-survey-mitra") {
            
            fetchListUser({ regional: [userDataStore.regional], witel: userDataStore.witel, vendor: userDataStore.vendor });
            fetchPolygon(user.userId);
        }
        
        if (userDataStore.role === "admin-survey-branch") {
            fetchListUser({ regional: [userDataStore.regional], witel: userDataStore.witel, vendor: "" });
            fetchPolygon(user.userId);
        }
    }, [userDataStore.role]);

    useEffect(() => {
        getUser();
    }, []);

    return (
        <Wrapper
            user={user}
            title="Assignment Microdemand"
            tab={{
                value: "assignment",
                options: tabOptions(user),
                onChange: (value) => {
                    router.push("/planning/dashboard-microdemand/" + value);
                },
            }}
            backPath="/"
        >
            <Responsive className="pt-0 pb-16">
                <TitleBar>Menu yang digunakan oleh Supervisor untuk memberikan assignment kepada surveyor</TitleBar>
                <Container>
                    <When condition={device !== "mobile"}>
                        <Title>Assignment Microdemand</Title>
                    </When>
                    <When condition={userDataStore.role === "supervisor-survey-mitra"}>
                        <SurveyorFilter device={device} />
                        <SurveyorTable user={user} device={device} />
                        <SurveyorActivateModal refresh={getData} />
                        <SurveyorAddModal user={user} refresh={getData} />
                    </When>
                    <When condition={userDataStore.role === "admin-survey-branch"}>
                        <SurveyorFilter device={device} />
                        <SurveyorTable user={user} device={device} />
                        <SurveyorActivateModal refresh={getData} />
                        <SurveyorAddModal user={user} refresh={getData} />
                    </When>
                </Container>
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

export default MicrodemandAssignmentPage;
