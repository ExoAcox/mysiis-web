import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { When } from "react-if";
import { getServer, session } from "@libs/session";
import {
    CardCountPolygon,
    PolygonAdd,
    PolygonApproval,
    PolygonFilter,
    PolygonTable,
    PolygonUpdateStatus,
} from "@features/planning/dashboard-microdemand/components/polygon";

import { Container, TitleBar } from "@features/planning/dashboard-microdemand/components/global";
import { getUserData, tabOptions } from "@features/planning/dashboard-microdemand/functions/common";
import { useFilterStore } from "@features/planning/dashboard-microdemand/store/polygon";

import { Responsive, Wrapper } from "@components/layout";
import { fetchPolygonCount, fetchPolygonTsel } from "@features/planning/dashboard-microdemand/queries/global/polygon";
import { intersection } from "@functions/common";
import { getSupervisor } from "@api/survey-demand/supervisor";

const MicrodemandAssignmentPage: React.FC<{ user: User; device: Device }> = ({ user, device }) => {
    const router = useRouter();
    const filterStore = useFilterStore();
    const { status, keyword, page, row } = filterStore;
    const { role_keys, tsel_area, tsel_region, tsel_branch } = user;

    const getDataCount = async (init?: string) => {
        if (init) filterStore.set({ page: 1 });
        filterStore.set({ area: tsel_area, regional: tsel_region, witel: tsel_branch });           

        if (role_keys.includes("admin-survey-branch")) { 
            fetchPolygonCount({ 
                area: JSON.stringify([tsel_area!]), 
                region: JSON.stringify([tsel_region!]), 
                branch: JSON.stringify([tsel_branch!]) 
            });
        } else if(role_keys.includes("admin-survey-region")) {
            fetchPolygonCount({ 
                area: JSON.stringify([tsel_area!]), 
                region: JSON.stringify([tsel_region!]) 
            });
        } else if(role_keys.includes("admin-survey-area")) {
            fetchPolygonCount({ 
                area: JSON.stringify([tsel_area!])
            });
        } else if(role_keys.includes("supervisor-survey-mitra")) {
            getSupervisor(user.userId)
            .then((supervisor) => {                
                fetchPolygonCount({ 
                    area: JSON.stringify([tsel_area!]),
                    branch: JSON.stringify(supervisor.mysista_witel), 
                    vendor: JSON.stringify([supervisor.mysista_source]),
                });
            });
        } else {
            fetchPolygonCount({ 
                area: JSON.stringify(["ALL"]) 
            });
        }
    };

    const getData = async (init?: string) => {
        if (init) filterStore.set({ page: 1 });
        filterStore.set({ area: tsel_area, regional: tsel_region, witel: tsel_branch });           

        if (role_keys.includes("admin-survey-branch")) { 
            fetchPolygonTsel({
                page: init ? 1 : page,
                row,
                area: tsel_area!,
                treg: tsel_region!,
                witel: JSON.stringify([tsel_branch!]),
                status: status,
                search: keyword,
            });
        } else if(role_keys.includes("admin-survey-region")) {
            fetchPolygonTsel({
                page: init ? 1 : page,
                row,
                area: tsel_area!,
                treg: tsel_region!,
                status: status,
                search: keyword,
            });
        } else if(role_keys.includes("admin-survey-area")) {
            fetchPolygonTsel({
                page: init ? 1 : page,
                row,
                area: tsel_area!,
                status: status,
                search: keyword,
            });
        } else if(role_keys.includes("supervisor-survey-mitra")) {
            getSupervisor(user.userId)
            .then((supervisor) => {                
                fetchPolygonTsel({
                    page: init ? 1 : page,
                    row,
                    witel: JSON.stringify(supervisor.mysista_witel),
                    vendor: supervisor.mysista_source,
                    status: status,
                    search: keyword,
                });
            });
        } else {
            fetchPolygonTsel({
                page: init ? 1 : page,
                row,
                area: "ALL",
                status: status,
                search: keyword,
            });
        }
    };

    useEffect(() => {
        getData("init");
    }, [status, keyword]);

    useEffect(() => {
        getDataCount("init");
    }, []);

    useEffect(() => {
        getData();
    }, [page, row]);

    useEffect(() => {
        getUserData(user);
    }, []);

    return (
        <Wrapper
            user={user}
            title="Polygon Microdemand"
            tab={{
                value: "polygon",
                options: tabOptions(user),
                onChange: (value) => {
                    router.push("/planning/dashboard-microdemand/" + value);
                },
            }}
            backPath="/"
        >
            <Responsive className="pt-0 pb-16">
                <TitleBar>Menu yang digunakan oleh Admin branch untuk melakukan approval polygon yang akan dilakukan survey.</TitleBar>
                <Container>
                    <When condition={intersection(role_keys, ["admin-survey-nasional","admin-survey-area","admin-survey-region","admin-survey-branch","supervisor-survey-mitra"]).length}>
                        <CardCountPolygon />
                        <PolygonFilter user={user} device={device} />
                        <PolygonTable user={user} device={device} />
                        <PolygonApproval refresh={getData} user={user} />
                        <PolygonUpdateStatus user={user} refresh={getData} />
                        <PolygonAdd user={user} refresh={getData} />
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
